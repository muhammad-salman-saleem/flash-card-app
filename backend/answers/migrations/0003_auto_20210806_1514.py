# Generated by Django 2.2.24 on 2021-08-06 15:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('answers', '0002_auto_20210806_1423'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CorrectAnswer',
        ),
        migrations.DeleteModel(
            name='UserAnswer',
        ),
    ]
