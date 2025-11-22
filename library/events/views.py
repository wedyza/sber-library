from rest_framework import views, viewsets, permissions, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event, EventFeedback, Tag, EventSignup
from django.utils import timezone
from .serializers import EventFeedbackSeriazlier, EventSerializer, TagSerializer
from books.serializers import SwitchSerializer
from users.serializers import UserSerializer

class EventViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (permissions.AllowAny, ) #ManagerOrReadOnly in future

    def get_serializer_context(self):
        return super().get_serializer_context() | {"request": self.request}

    @action(
        detail=False,
        methods=["GET"],
        url_path="passed",
        serializer_class=EventSerializer
    )
    def get_event_passed_list(self, request):
        today = timezone.now()
        return Response(self.get_serializer(instance=Event.objects.filter(time__lte=today).all(), many=True).data)
    
    @action(
        detail=False,
        methods=["GET"],
        url_path="actual",
        serializer_class=EventSerializer
    )
    def get_event_actual_list(self, request):
        today = timezone.now()
        return Response(self.get_serializer(instance=Event.objects.filter(time__gt=today).all(), many=True).data)


    @action(methods=["GET"], url_path="signups", detail=True, permission_classes=(permissions.AllowAny,), serializer_class=UserSerializer)
    def signups(self, request, pk):
        event = Event.objects.get(id=pk)
        return Response(self.get_serializer(event.participants, many=True).data)

    @action(methods=["POST"], url_path="switch_signup", detail=True, serializer_class=SwitchSerializer, permission_classes=(permissions.IsAuthenticated,))
    def switch_signup(self, request, pk):
        enable = self.get_serializer(data=request.data)
        if not enable.is_valid():
            return Response(enable.errors, status=status.HTTP_400_BAD_REQUEST)
        event = Event.objects.get(id=pk)
        turn = enable.data["enable"]
        if turn and not event.signups.filter(user=request.user).exists():
            if event.spots - event.signups.count() > 0:
                EventSignup.objects.create(user=request.user, event=event)
                event.participants.add(request.user)
            else:
                return Response({"detail": "No more spots left!"}, status=status.HTTP_400_BAD_REQUEST)
        elif not turn:
            event.signups.filter(user=request.user).remove()
        
        return Response({"enable": turn, "spots_left": event.spots - event.participants.all().count()})

    @action(methods=["GET"], url_path="feedbacks", detail=True, serializer_class=EventFeedbackSeriazlier, permission_classes=(permissions.IsAuthenticated, )) # IsManagerOnly
    def get_feedbacks(self, request, pk):
        event = Event.objects.get(id=pk)
        feedbacks = EventFeedback.objects.filter(event=event).all()
        return Response(self.get_serializer(instance=feedbacks, many=True).data)

class EventFeedbackViewSet(viewsets.GenericViewSet, mixins.UpdateModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin):
    permission_classes = (permissions.IsAuthenticated, ) #ManagerOrOwnerOrReadOnly
    queryset = EventFeedback.objects.all()
    serializer_class = EventFeedbackSeriazlier    

    def create(self, request, *args, **kwargs):
        feedback = self.get_serializer(data=request.data)

        if not feedback.is_valid():
            return Response(feedback.errors, status=status.HTTP_400_BAD_REQUEST)
        
        event = feedback.validated_data['event']
        
        today = timezone.now()
        if event.time > today:
            return Response({"detail": "Нельзя оставить отзыв на мероприятие, которого еще не было!"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not request.user.events.filter(event=event).exists():
            return Response({"detail": "Нельзя оставить отзыв на мероприятие, на котором вас не было!"}, status=status.HTTP_400_BAD_REQUEST)

        feedback.save(user=request.user)

        return Response(feedback.data)


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (permissions.AllowAny, ) #потом сделать только для MaganerOrReadOnly
