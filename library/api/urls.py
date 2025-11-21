from django.urls import path, include, re_path
from django.conf.urls.static import static
from users.views import UsersViewSet
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from rest_framework import permissions, routers

router = routers.DefaultRouter()

router.register("users", UsersViewSet, basename="users")


urlpatterns = [
    path("auth/", include("users.urls")),
    path("", include("books.urls")),
    path("", include(router.urls)),
    path("", include("events.urls")),
    path("", include("manager.urls"))
]


schema_view = get_schema_view(
    openapi.Info(
        title="library API",
        default_version="v1",
        description="Документация для приложения library API",
        # terms_of_service="URL страницы с пользовательским соглашением",
        contact=openapi.Contact(email="wedyza@mail.ru"),
        license=openapi.License(name="BSD License"),
    ),
    url="http://188.68.80.72:8000" if settings.CONTAINER_LAUNCHER else "http://localhost:8000",
    public=True,
    permission_classes=(permissions.AllowAny,),
)

if settings.DEBUG:
    urlpatterns += [
        re_path(
            r"^swagger(?P<format>\.json|\.yaml)$",
            schema_view.without_ui(cache_timeout=0),
            name="schema-json",
        ),
        re_path(
            r"^swagger/$",
            schema_view.with_ui("swagger", cache_timeout=0),
            name="schema-swagger-ui",
        ),
        re_path(
            r"^redoc/$",
            schema_view.with_ui("redoc", cache_timeout=0),
            name="schema-redoc",
        ),
    ]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )  # pragma: no cover
