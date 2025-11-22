from django.urls import path, include
from rest_framework import routers
from .views import EventFeedbackViewSet, EventViewSet, TagViewSet

router = routers.DefaultRouter()

router.register("events", EventViewSet, basename="events")
router.register("tags", TagViewSet, basename="tags")
router.register("event_feedbacks", EventFeedbackViewSet, basename='event-feedbacks')

urlpatterns = [
    path('', include(router.urls))
]
