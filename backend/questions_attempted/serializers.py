from rest_framework import serializers

from .models import QuestionsAttempted


class QuestionsAttemptedSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionsAttempted
        fields = "__all__"




