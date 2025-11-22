from rest_framework import views, viewsets, permissions, status, mixins
from .models import Coworking, CoworkingSession
from .serialzers import CoworkingSerializer, CoworkingSessionSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from books.serializers import SwitchSerializer


class CoworkingViewSet(viewsets.ModelViewSet):
    queryset = Coworking.objects.all()
    permission_classes = (permissions.AllowAny, ) #AdminOrManagerOrReadOnly
    serializer_class = CoworkingSerializer

    def get_serializer_context(self):
        return super().get_serializer_context() | {'request': self.request}

    @action(methods=["POST"], url_path="signup/(?P<session_id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})", detail=False, serializer_class=SwitchSerializer, permission_classes=(permissions.IsAuthenticated,))
    def signup_session(self, request, session_id=None):
        enable = self.get_serializer(data=request.data)
        if not enable.is_valid():
            return Response(enable.errors, stauts=status.HTTP_400_BAD_REQUEST)
        
        try:
            session = CoworkingSession.objects.get(id=session_id)
        except:
            return Response({"detail": "Did not found any session with that id"}, status=status.HTTP_404_NOT_FOUND)

        turn = enable.data["enable"]

        if turn and not session.signups.contains(request.user):
            session.signups.add(request.user)
        else:
            session.signups.remove(request.user)

        return Response({"enable": turn})

class CoworkingSessionViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.DestroyModelMixin):
    queryset = CoworkingSession.objects.all()
    serializer_class = CoworkingSessionSerializer
    permission_classes = (permissions.AllowAny, ) #ManagerOnly