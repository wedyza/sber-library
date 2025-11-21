from django.urls import path, include
from rest_framework import routers
from .views import AuthorViewSet, BookViewSet, GenreViewSet


router = routers.DefaultRouter()

router.register("books", BookViewSet, basename="books")
router.register("genres", GenreViewSet, basename="genres")
router.register("authors", AuthorViewSet, basename="authors")

urlpatterns = [
    path("", include(router.urls))
]
