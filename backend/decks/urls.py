from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DecksViewSet

app_name = "decks"

router = DefaultRouter()
router.register("", DecksViewSet, basename="decks")

urlpatterns = [
    path("decks/", include(router.urls)),
]
