from rest_framework import serializers

from user_score.models import UserScore


class UserScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserScore
        fields = "__all__"




