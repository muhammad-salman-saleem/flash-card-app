from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from django.conf import settings

from utils.models import BaseModel
from utils import generate_file_name


class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)

    objects = UserManager()

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})


class Profile(BaseModel):
    app_types = [("android", "Android"), ("ios","iOS")]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_profile"
    )
    stripe_customer_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_payment_intent_id = models.CharField(max_length=255, null=True, blank=True)
    profile_image = models.ImageField(
        upload_to=generate_file_name, null=True, blank=True
    )
    payment_done = models.BooleanField(default=False)
    is_free_user = models.BooleanField(default=True)
    is_premium_user = models.BooleanField(default=False)
    subscription = models.BooleanField(default=False)
    stripe_subscription_id = models.CharField(max_length=255, null=True, blank=True)
    subscription_expires_ms = models.CharField(max_length=255, null=True, blank=True)
    original_transaction_id = models.CharField(max_length=255, null=True, blank=True)
    subscription_product_id = models.CharField(max_length=255, null=True, blank=True)
    app_type = models.CharField(choices=app_types, max_length=10, null=True, blank=True)

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"

    def __unicode__(self):
        return f"{self.user}"

    def __str__(self) -> str:
        return f"{self.user}"
