
from django.db import models

from utils.models import BaseModel

class Answer(BaseModel):
    answer_text = models.CharField(max_length=255)
    
    class Meta:
        verbose_name = "Answer"
        verbose_name_plural = "Answer"


