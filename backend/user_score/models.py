
from django.db import models

from utils.models import BaseModel
from users.models import User
from decks.models import Decks

class UserScore(BaseModel):
    deck = models.ForeignKey(
        Decks, on_delete=models.CASCADE, related_name="deck_score"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="deck_user")
    score = models.IntegerField(default=0)
    
    class Meta:
        verbose_name = "UserScore"
        verbose_name_plural = "UserScore"


