# Generated by Django 2.2.24 on 2021-11-16 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_profile_stripe_payment_intent_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='is_free_user',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='is_premium_user',
            field=models.BooleanField(default=False),
        ),
    ]