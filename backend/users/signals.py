import stripe
from django.core.management import call_command
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from djstripe.models import Coupon
from django.contrib.sites.shortcuts import get_current_site
from .models import User, Profile
from rest_framework.authtoken.models import Token

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.urls import reverse
from django.conf import settings
from django_rest_passwordreset.signals import reset_password_token_created

from allauth.account.models import EmailAddress
from allauth.account.signals import email_confirmed


@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        "name": reset_password_token.user.name
        if reset_password_token.user.name
        else "there",
        "email": reset_password_token.user.email,
        "reset_password_url": instance.request.build_absolute_uri(
            reverse("users:forget_password_confirm", args=(reset_password_token.key,))
        ),
    }

    # render email text
    email_html_message = render_to_string("email/user_reset_password.html", context)
    email_plaintext_message = render_to_string("email/user_reset_password.txt", context)

    msg = EmailMultiAlternatives(
        "Password Reset",
        email_plaintext_message,
        settings.DEFAULT_FROM_EMAIL,
        [reset_password_token.user.email],
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()


@receiver(post_save, sender=User)
def create_related_profile(sender, instance, created, *args, **kwargs):
    # Notice that we're checking for `created` here. We only want to do this
    # the first time the `User` instance is created. If the save that caused
    # this signal to be run was an update action, we know the user already
    # has a profile.
    if instance and created:
        instance.profile = Profile.objects.create(user=instance)


@receiver(post_delete, sender=User)
def delete_user_account(sender, instance, *args, **kwargs):

    context = {
        "name": instance.name
    }

    # render email text
    email_html_message = render_to_string("email/user_account_delete.html", context)
    email_plaintext_message = render_to_string("email/user_account_delete.txt", context)

    msg = EmailMultiAlternatives(
        "Account Cancellation",
        email_plaintext_message,
        settings.DEFAULT_FROM_EMAIL,
        [instance.email],
    )

    msg.attach_alternative(email_html_message, "text/html")
    msg.send()


@receiver(post_save, sender=Coupon)
def gen_coupon_from_stripe(sender, instance, created, **kwargs):

    # generates the coupon for admin panel

    if created:
        coupon = stripe.Coupon.create(
            percent_off=instance.percent_off,
            duration=instance.duration,
            name=instance.name,
        )

        instance.id = coupon.id
        instance.save()


@receiver(email_confirmed)
def update_user_email(sender, request, email_address, **kwargs):
    email_address.set_as_primary()

    stale_addresses = (
        EmailAddress.objects.filter(user=email_address.user)
        .exclude(primary=True)
        .delete()
    )
