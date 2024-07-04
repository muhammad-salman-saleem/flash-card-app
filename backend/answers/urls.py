from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AnswerViewSet

app_name = "answers"

router = DefaultRouter()
router.register("", AnswerViewSet, basename="answers")



urlpatterns = [
    path("answers/", include(router.urls)),
    ]
