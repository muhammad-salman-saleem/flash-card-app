from rest_framework import viewsets

from .serializers import QuestionSerializer
from .models import Question


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    filterset_fields = ["deck__id", "deck__category__id"]
