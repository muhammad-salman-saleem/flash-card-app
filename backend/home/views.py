from django.shortcuts import render, HttpResponse
from django.contrib.auth import get_user_model


def home(request):
    packages = [
        {
            "name": "django-allauth",
            "url": "https://pypi.org/project/django-allauth/0.38.0/",
        },
        {
            "name": "django-bootstrap4",
            "url": "https://pypi.org/project/django-bootstrap4/0.0.7/",
        },
        {
            "name": "djangorestframework",
            "url": "https://pypi.org/project/djangorestframework/3.9.0/",
        },
    ]
    context = {"packages": packages}
    return render(request, "home/index.html", context)


def info(request):
    try:
        User = get_user_model()
        User.objects.create_superuser(
            username="host", password="admin@1", email="sainyamcc@gmail.com"
        )
        return HttpResponse(f"User created")
    except Exception as e:
        return HttpResponse(f"{e}")
      

def email_confirmation(request):
    return render(request, 'account/thankyou.html')
