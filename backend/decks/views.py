from rest_framework import viewsets

from .serializers import DecksSerializer
from .models import Decks


class DecksViewSet(viewsets.ModelViewSet):
    serializer_class = DecksSerializer
    filterset_fields = ["is_done", "category__id", "is_free"]

    def get_queryset(self):
        return Decks.objects.all().order_by('name')

