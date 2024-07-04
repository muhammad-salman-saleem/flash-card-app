
from django.db.models.constraints import UniqueConstraint
from questions.models import Question
from django.db import models

from utils.models import BaseModel
from users.models import User
from decks.models import Decks

class QuestionsAttempted(BaseModel):
    deck = models.ForeignKey(
        Decks, on_delete=models.CASCADE, related_name="deck_attempted"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_attempted")    
    question = models.ForeignKey(Question,null=True, on_delete=models.CASCADE, related_name="user_questions")
    user_answer_correct = models.BooleanField(default=False)

    class Meta:
        verbose_name = "QuestionsAttempted"
        verbose_name_plural = "QuestionsAttempted"        


