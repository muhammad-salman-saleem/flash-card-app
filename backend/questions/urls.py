from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import QuestionViewSet

app_name = "questions"

router = DefaultRouter()
router.register("", QuestionViewSet, basename="questions")

urlpatterns = [
    path("questions/", include(router.urls)),
]
