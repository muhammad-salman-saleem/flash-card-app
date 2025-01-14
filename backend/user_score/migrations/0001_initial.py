# Generated by Django 2.2.24 on 2021-08-07 07:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('decks', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserScore',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('score', models.IntegerField(default=0)),
                ('deck', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='deck_score', to='decks.Decks')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='deck_user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'UserScore',
                'verbose_name_plural': 'UserScore',
            },
        ),
    ]
