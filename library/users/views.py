from rest_framework.response import Response
from rest_framework import status, viewsets, mixins
from rest_framework.views import APIView
from .serializers import (
    UserCreateSerializer,
    UserLoginSerializer,
    UserLoginOTPSerializer,
    UserSerializer
)
from django.contrib.auth import get_user_model
from .utils import generate_lib_code, generate_otp, form_qr
from .tasks import send_otp_email
from drf_yasg.utils import swagger_auto_schema
from rest_framework import permissions
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomAbstractUser
from drf_yasg import openapi
from rest_framework.decorators import action
from books.serializers import BookSerializer
from events.serializers import EventSerializer, EventSignupSerializer
from events.models import Event
from django.http import HttpResponse


# Create your views here.

User = get_user_model()


class RegisterManagerView(APIView):
    permission_classes = (permissions.IsAdminUser,) # тут свой пермишн создать надо будет

    @swagger_auto_schema(request_body=UserCreateSerializer)
    def post(self, request):
        new_user = UserCreateSerializer(data=request.data)
        if not new_user.is_valid():
            return Response(new_user.errors, status=status.HTTP_400_BAD_REQUEST)
        user = new_user.save(user_type=CustomAbstractUser.UserType.MANAGER) # user_type = manager

        otp = generate_otp()
        user.otp = otp
        user.otp_expires = timezone.now() + timezone.timedelta(minutes=5)
        user.save()
        send_otp_email.delay(new_user.data["email"], otp)

        return Response( #pragma: no cover
            {
                "message": "Письмо с одноразовым кодом отправлено вам на почту. Он действителен в течении 5 минут"
            },
            status=status.HTTP_200_OK,
        )
        # otp         


class RegisterView(APIView): # Пока что разделим эту логику, но скорее всего позже совместим, чтобы сделать единой с логином. Просто добавим обработку в except
    permission_classes = (permissions.AllowAny,)

    @swagger_auto_schema(request_body=UserCreateSerializer)
    def post(self, request):
        new_user = UserCreateSerializer(data=request.data)
        if not new_user.is_valid():
            return Response(new_user.errors, status=status.HTTP_400_BAD_REQUEST)
        user = new_user.save(lib_code=generate_lib_code())

        otp = generate_otp()
        user.otp = otp
        user.otp_expires = timezone.now() + timezone.timedelta(minutes=5)
        
        user.save()
        
        send_otp_email(user.email, otp)

        return Response(  # pragma: no cover
            {
                "message": "Письмо с одноразовым кодом отправлено вам на почту. Он действителен в течении 5 минут"
            },
            status=status.HTTP_200_OK,
        )


class RegisterManagerView(APIView): # Пока что разделим эту логику, но скорее всего позже совместим, чтобы сделать единой с логином. Просто добавим обработку в except
    permission_classes = (permissions.AllowAny,)

    @swagger_auto_schema(request_body=UserCreateSerializer)
    def post(self, request):
        new_user = UserCreateSerializer(data=request.data)
        if not new_user.is_valid():
            return Response(new_user.errors, status=status.HTTP_400_BAD_REQUEST)
        user = new_user.save(lib_code=generate_lib_code(), user_type=CustomAbstractUser.UserType.MANAGER)

        return Response(UserSerializer(instance=user).data)



class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    @swagger_auto_schema(request_body=UserLoginSerializer)
    def post(self, request):
        email = UserLoginSerializer(data=request.data)
        if not email.is_valid():
            return Response(email.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email.data["email"])
        except User.DoesNotExist as e:
            return Response(
                {"error": "User is not found"}, status=status.HTTP_404_NOT_FOUND
            )

        otp = generate_otp()
        user.otp = otp
        user.otp_expires = timezone.now() + timezone.timedelta(minutes=5)
        user.save()

        send_otp_email(email.data["email"], otp)

        return Response(
            {
                "message": "Письмо с одноразовым кодом отправлено вам на почту. Он действителен в течении 5 минут"
            },
            status=status.HTTP_200_OK,
        )


class ValidateOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    @swagger_auto_schema(request_body=UserLoginOTPSerializer)
    def post(self, request):
        payload = UserLoginOTPSerializer(data=request.data)

        if not payload.is_valid():
            return Response(payload.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=payload.data["email"])
        except User.DoesNotExist:
            return Response(
                {"error": "Пользователя с такой почтой не существует."},
                status=status.HTTP_404_NOT_FOUND,
            )

        otp = payload.data["otp"]
        if user.otp == otp:
            if timezone.now() > user.otp_expires:
                return Response(  # pragma: no cover
                    {"error": "Срок действия пароля истек"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.otp = None
            user.otp_expires = None
            user.save()

            refresh = RefreshToken.for_user(user)

            refresh.payload.update({"user_id": user.pk.urn, "email": user.email})

            return Response(
                {"refresh": str(refresh), "access": str(refresh.access_token)},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Неправильный код."}, status=status.HTTP_400_BAD_REQUEST
            )
        
class UsersViewSet(
    viewsets.GenericViewSet,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    ):
    queryset = CustomAbstractUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    @action(
        detail=False,
        methods=["GET", "PATCH"],
        permission_classes=(permissions.IsAuthenticated,),
        url_path="me",
    )
    def active_user(self, request):
        if request.method == "GET":
            serializer = self.serializer_class(request.user)
            return Response(serializer.data)
        serializer = self.serializer_class(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors)

    @action(
        detail=False,
        methods=["GET"],
        permission_classes=(permissions.IsAuthenticated,),
        url_path="me/wishlist",
        serializer_class=BookSerializer
    )
    def get_my_wishlist(self, request):
        return Response(self.get_serializer(instance=request.user.wishlist.all(), many=True).data)
    
    @action(
        detail=False,
        methods=["GET"],
        permission_classes=(permissions.IsAuthenticated,),
        url_path="me/events/actual",
        serializer_class=EventSignupSerializer
    )
    def get_my_event_actual_list(self, request):
        today = timezone.now()
        signups = request.user.events.select_related("event").filter(event__time__gt=today).all()
        return Response(self.get_serializer(instance=signups, many=True).data)
    
    @action(
        detail=False,
        methods=["GET"],
        permission_classes=(permissions.IsAuthenticated,),
        url_path="me/events/passed",
        serializer_class=EventSignupSerializer
    )
    def get_my_event_passed_list(self, request):
        today = timezone.now()
        signups = request.user.events.select_related("event").filter(event__time__lte=today).all()
        return Response(self.get_serializer(instance=signups, many=True).data)
    
    # @action(
    #     detail=False,
    #     methods=["GET"],
    #     permission_classes=(permissions.IsAuthenticated,),
    #     url_path="me/qr"
    # )
    # def get_my_qr(self, request):
    #     url = 'http://192.168.137.1:8080/api/v1/swagger/' # тут будем формировать ссылку на фронт,чтобы открылась страница покупателя на интерфейсе библиотекаря
    #     buf = form_qr(url)
    #     return HttpResponse(buf, content_type="image/png")


