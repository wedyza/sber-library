from rest_framework import views, viewsets, permissions, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event
from django.utils import timezone
from .serializers import EventSerializer
from books.serializers import SwitchSerializer
from users.serializers import UserSerializer

class EventViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
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
        if turn and not event.participants.contains(request.user):
            if event.spots - event.participants.count() > 0:
                event.participants.add(request.user)
            else:
                return Response({"detail": "No more spots left!"}, status=status.HTTP_400_BAD_REQUEST)
        elif not turn:
            event.participants.remove(request.user)
        
        return Response({"enable": turn, "spots_left": event.spots - event.participants.all().count()})