from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.views.generic import DetailView, RedirectView, UpdateView
from django.shortcuts import render
from django_rest_passwordreset.models import get_password_reset_token_expiry_time
from django_rest_passwordreset import models
from datetime import timedelta

from django.core.exceptions import ValidationError
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404 as _get_object_or_404
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class UserDetailView(LoginRequiredMixin, DetailView):

    model = User
    slug_field = "username"
    slug_url_kwarg = "username"


user_detail_view = UserDetailView.as_view()


class UserUpdateView(LoginRequiredMixin, UpdateView):

    model = User
    fields = ["name"]

    def get_success_url(self):
        return reverse("users:detail", kwargs={"username": self.request.user.username})

    def get_object(self):
        return User.objects.get(username=self.request.user.username)


user_update_view = UserUpdateView.as_view()


class UserRedirectView(LoginRequiredMixin, RedirectView):

    permanent = False

    def get_redirect_url(self):
        return reverse("users:detail", kwargs={"username": self.request.user.username})


user_redirect_view = UserRedirectView.as_view()


def validate_token(token):
    # get token validation time
    password_reset_token_validation_time = get_password_reset_token_expiry_time()

    # find token
    try:
        reset_password_token = _get_object_or_404(models.ResetPasswordToken, key=token)
    except (
        TypeError,
        ValueError,
        ValidationError,
        Http404,
        models.ResetPasswordToken.DoesNotExist,
    ):
        raise Http404(_("This link has already been used or does not exist."))

    # check expiry date
    expiry_date = reset_password_token.created_at + timedelta(
        hours=password_reset_token_validation_time
    )

    if timezone.now() > expiry_date:
        # delete expired token
        reset_password_token.delete()
        raise Http404(_("The link has expired."))
    return token


def password_reset(request, token):
    try:
        token = validate_token(token)
        return render(request, "password_reset.html", {"token": token})
    except Http404 as e:
        return HttpResponse(f"<p>{str(e)}</p>")
