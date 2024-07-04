"""late_limit_27923 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic.base import TemplateView
from allauth.account.views import confirm_email
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.routers import DefaultRouter
from late_limit_27923.views import PaymentViewSet, StripeWebhook, UpdateSubscriptionProfile, AppleWebhook

router = DefaultRouter()
router.register("stripe", PaymentViewSet, basename="stripe")
router.register("apple", AppleWebhook, basename="apple")
router.register("subscribed_via_iap", UpdateSubscriptionProfile, basename="subscribed_via_iap")

urlpatterns = [
    path("", include("home.urls")),
    path("accounts/", include("allauth.urls")),
    path("modules/", include("modules.urls")),
    path("api/v1/", include("home.api.v1.urls")),
    re_path(
        r"^api/password_reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("admin/", admin.site.urls),
    path("users/", include("users.urls", namespace="users")),
    path("rest-auth/", include("rest_auth.urls")),
    # Override email confirm to use allauth's HTML view instead of rest_auth's API view
    path("rest-auth/registration/account-confirm-email/<str:key>/", confirm_email),
    path("rest-auth/registration/", include("rest_auth.registration.urls")),
    # custom apps
    path("api/v1/", include("category.urls")),
    path("api/v1/", include("decks.urls")),
    path("api/v1/", include("questions.urls")),
    path("api/v1/", include("answers.urls")),
    path("api/v1/", include("user_score.urls")),
    path("api/v1/", include("questions_attempted.urls")),
    path("api/v1/", include("resources.urls")),
    path("", include(router.urls)),
    path("stripe/", include("djstripe.urls", namespace="djstripe")),
    path("stripe_webhook/", StripeWebhook.as_view(), name="stripe_webhook"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Flash Cards app"
admin.site.site_title = "Flash Cards app Admin Portal"
admin.site.index_title = "Flash Cards app Admin"

# swagger
api_info = openapi.Info(
    title="Straight A Nursing API",
    default_version="v1",
    description="API documentation for Straight A Nursing App",
)

schema_view = get_schema_view(
    api_info,
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns += [
    path("api-docs/", schema_view.with_ui("swagger", cache_timeout=0), name="api_docs")
]


urlpatterns += [path("", TemplateView.as_view(template_name="index.html"))]
urlpatterns += [
    re_path(r"^(?:.*)/?$", TemplateView.as_view(template_name="index.html"))
]
