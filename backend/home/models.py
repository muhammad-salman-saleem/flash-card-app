from django.db import models

from utils.models import BaseModel


class FAQ(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField()

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQ's"

    def __unicode__(self):
        return f"{self.title}"

    def __str__(self):
        return f"{self.title}"
