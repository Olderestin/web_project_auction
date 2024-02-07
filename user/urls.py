from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from user.views import LoginAPIView
from user.views import LoguotAPIView
from user.views import RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="api-register"),
    path("login/", LoginAPIView.as_view(), name="api-login"),
    path("logout", LoguotAPIView.as_view(), name="api-logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="api-token-refresh"),
    # path('profile/', UserProfileView.as_view(), name='api-profile'),
]
