from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import QuestionsAttemptedViewSet

app_name = "questions_attempted"

router = DefaultRouter()
router.register("", QuestionsAttemptedViewSet, basename="questions_attempted")



urlpatterns = [
    path("questions_attempted/", include(router.urls)),
    ]
