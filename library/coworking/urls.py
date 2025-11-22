from django.urls import path, include
from rest_framework import routers
from .views import CoworkingViewSet, CoworkingSessionViewSet


router = routers.DefaultRouter()

router.register('coworkings', CoworkingViewSet, basename='coworkings')
# router.register('coworking_sessions', CoworkingSessionViewSet, basename='sessions')

urlpatterns = [
    path('', include(router.urls))
]
