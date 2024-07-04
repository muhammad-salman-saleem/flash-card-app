from django.urls import path, include
from rest_framework.routers import DefaultRouter

from user_score.views import UserScoreViewSet

app_name = "user_score"

router = DefaultRouter()
router.register("", UserScoreViewSet, basename="user_score")



urlpatterns = [
    path("user_score/", include(router.urls)),
    ]
