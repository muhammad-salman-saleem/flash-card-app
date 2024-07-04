from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import TermsAndConditionsViewSet

router = DefaultRouter()
# because we are using a custom queryset for our viewset, the basename
# must be specified explicitly here. See: https://www.django-rest-framework.org/api-guide/routers/#Usage
# Your policy will be available at : /modules/terms_and_conditions/
router.register("", TermsAndConditionsViewSet, basename="terms-and-conditions")

urlpatterns = [
    path("", include(router.urls)),
]
