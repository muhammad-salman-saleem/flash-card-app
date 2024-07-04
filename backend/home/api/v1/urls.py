from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_auth.registration.views import (
    SocialAccountDisconnectView,
    SocialAccountListView,
)

from . import viewsets
from home.api.v1.viewsets import (
    LogoutViewSet,
    SingleUserView,
    SocialUserView,
    UpdateProfileView,
    FAQView,
    DeleteUserView,
    UpdateUserView,
)

router = DefaultRouter()
# router.register("signup", SignupViewSet, basename="signup")
# router.register("login", LoginViewSet, basename="login")
router.register("rn-logout", LogoutViewSet, basename="logout")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "update_profile/<int:user__pk>/",
        UpdateProfileView.as_view(),
        name="auth_update_profile",
    ),
    path("user-info/", SingleUserView.as_view(), name="single-user-view"),
    path("social-user-info/", SocialUserView.as_view(), name="social-user-view"),
    path(
        "faq/",
        FAQView.as_view(),
        name="faq",
    ),
    path("apple/login/", viewsets.AppleLogin.as_view(), name="social_apple_login"),
    path("google/login/", viewsets.GoogleLogin.as_view(), name="social_google_login"),
    path(
        "google/connect/",
        viewsets.GoogleConnect.as_view(),
        name="social_google_connect",
    ),
    path(
        "facebook/login/",
        viewsets.FacebookLogin.as_view(),
        name="social_facebook_login",
    ),
    path(
        "socialaccounts/", SocialAccountListView.as_view(), name="social_account_list"
    ),
    # Allows to disconnect social account
    path(
        "socialaccounts/<int:pk>/disconnect/",
        SocialAccountDisconnectView.as_view(),
        name="social_account_disconnect",
    ),
    path("user/delete/", DeleteUserView.as_view(), name="deactivate-user"),
    path("user/<int:pk>/", UpdateUserView.as_view(), name="update-user-data"),
]
