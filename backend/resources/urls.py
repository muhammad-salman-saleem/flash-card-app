from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ResourceViewSet

app_name = "resources"

router = DefaultRouter()
router.register("", ResourceViewSet, basename="resources")

urlpatterns = [
    path("resources/", include(router.urls)),
]
