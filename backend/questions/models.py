from django.db import models

from utils.models import BaseModel
from decks.models import Decks

class Question(BaseModel):
    deck = models.ForeignKey(
        Decks, on_delete=models.CASCADE, related_name="deck_questions"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    right_answer = models.TextField(default="")

    class Meta:
        verbose_name = "Questions"
        verbose_name_plural = "Questions"

    def __unicode__(self):
        return f"{self.title}"

    def __str__(self):
        return f"{self.title}"
