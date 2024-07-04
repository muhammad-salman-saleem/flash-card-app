from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet

app_name = "category"

router = DefaultRouter()
router.register("", CategoryViewSet, basename="category")

urlpatterns = [
    path("category/", include(router.urls)),
]
