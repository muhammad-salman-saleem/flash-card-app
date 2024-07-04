from rest_framework import viewsets

from .serializers import AnswerSerializer
from answers.models import Answer


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer



