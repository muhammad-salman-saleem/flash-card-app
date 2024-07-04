from django.db import models

from utils.models import BaseModel


class Category(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(null=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __unicode__(self):
        return f"{self.name}"

    def __str__(self):
        return f"{self.name}"
