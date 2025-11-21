from rest_framework.decorators import action
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth import get_user_model
from rest_framework import views, viewsets, permissions, status, mixins
from .serializers import BookTakeoutSerializer
from users.models import CustomAbstractUser as User
from .models import BookTakeout
from django.utils import timezone
from datetime import timedelta

class BookTakeoutViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
    serializer_class = BookTakeoutSerializer
    permission_classes = (permissions.IsAuthenticated, ) #Is visitor/manager ?

    def get_queryset(self):
        return BookTakeout.objects.filter(user=self.request.user).all()
    
    @action(methods=["GET"], detail=False, url_path="actual")
    def get_actual_takeouts(self, request):
        """
        Возвращает текущие заимствования книг
        """
        today = timezone.now().date()
        miss_day = today - timedelta(days=30)
        return Response(self.get_serializer(BookTakeout.objects.filter(start_date__gt=miss_day).filter(return_date=None).all().order_by('start_date'), many=True).data)
    
    @action(methods=["GET"], detail=False, url_path="missed")
    def get_missed_takeouts(self, request):
        """
        Возвращает просроченные (больше месяца) заимствования книг
        """
        miss_day = (timezone.now() - timedelta(days=30)).date()
        return Response(self.get_serializer(BookTakeout.objects.filter(start_date__lt=miss_day).filter(return_date=None).all().order_by('start_date'), many=True).data)
    
    @action(methods=["GET"], detail=False, url_path="returned")
    def get_returned_takeouts(self, request):
        """
        Возвращает возвращенные (да-да-да, тавтология) заимствования книг
        """
        return Response(self.get_serializer(BookTakeout.objects.exclude(return_date=None).all().order_by('start_date').all(), many=True).data)
    