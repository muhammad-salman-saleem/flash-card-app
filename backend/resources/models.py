from django.db import models

from utils.models import BaseModel


class Resource(BaseModel):
    title = models.CharField(max_length=255)
    body = models.TextField()
    source_link = models.URLField()

    class Meta:
        verbose_name = "Resources"
        verbose_name_plural = "Resources"

    def __unicode__(self):
        return f"{self.title}"

    def __str__(self):
        return f"{self.title}"
