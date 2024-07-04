from rest_framework import viewsets

from .serializers import UserScoreSerializer
from user_score.models import UserScore


class UserScoreViewSet(viewsets.ModelViewSet):
    queryset = UserScore.objects.all()
    serializer_class = UserScoreSerializer



