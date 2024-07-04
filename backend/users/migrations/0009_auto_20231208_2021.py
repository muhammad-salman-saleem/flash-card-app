# Generated by Django 2.2.28 on 2023-12-08 20:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_profile_stripe_subscription_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='app_type',
            field=models.CharField(blank=True, choices=[('android', 'Android'), ('ios', 'iOS')], max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='original_transaction_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='subscription_expires_ms',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='subscription_product_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]