from django.db import models

from utils.models import BaseModel
from category.models import Category


class Decks(BaseModel):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="decks_category"
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    is_done = models.BooleanField(default=False)
    is_free = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Decks"
        verbose_name_plural = "Decks"

    def __unicode__(self):
        return f"{self.name}"

    def __str__(self):
        return f"{self.name}"
