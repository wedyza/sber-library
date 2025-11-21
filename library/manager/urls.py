from django.urls import re_path, path, include
from .views import BookTakeoutViewSet
from rest_framework import routers
# from .consumers import MyConsumer

router = routers.DefaultRouter()

router.register("book_takeouts", BookTakeoutViewSet, basename='takeouts')

urlpatterns = [
    # re_path(r'ws/somepath/$', MyConsumer.as_asgi()),
    path('', include(router.urls))
]