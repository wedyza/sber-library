from django.urls import path, include
from rest_framework import routers
from .views import EventViewSet

router = routers.DefaultRouter()

router.register("events", EventViewSet, basename="events")

urlpatterns = [
    path('', include(router.urls))
]
