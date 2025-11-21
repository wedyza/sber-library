from django.urls import path
from .views import LoginView, ValidateOTPView, RegisterView, RegisterManagerView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("register/", RegisterView.as_view(), name="registration"),
    path("register/manager/", RegisterManagerView.as_view(), name="manager-registration"),
    # path("register/manager/")
    path("create-otp/", LoginView.as_view(), name="email-otp-login"),
    path(
        "validate-otp/",
        ValidateOTPView.as_view(),
        name="email-otp-validate",
    ),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
