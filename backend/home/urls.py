from django.urls import path
from django.views.generic import TemplateView
from .views import home, info, email_confirmation

urlpatterns = [
    path("", home, name="home"),
    path("email-confirmed/", email_confirmation, name="email-confirmed"),
    path(
        ".well-known/apple-app-site-association",
        TemplateView.as_view(
            template_name="account/well-known/apple-app-site-association.html",
            content_type="application/json",
        ),
    ),
]
