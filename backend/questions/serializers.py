from rest_framework import serializers

from .models import Question
from questions_attempted.serializers import QuestionsAttemptedSerializer


class QuestionSerializer(serializers.ModelSerializer):

    user_answer = serializers.SerializerMethodField("get_user_answer")

    class Meta:
        model = Question
        fields = (
            "id",
            "uuid",
            "created_at",
            "updated_at",
            "title",
            "description",
            "right_answer",
            "deck",
            "user_answer",
        )
        read_only_fields = ("user_answer",)


    def get_user_answer(self, obj):
        user = self.context['request'].user
        answer = obj.user_questions.filter(user=user).first()

        if answer:
            return {
                'id': answer.id,
                'user_answer_correct': answer.user_answer_correct,
                'created_at': answer.created_at,
                'updated_at': answer.updated_at,
                'uuid': answer.uuid
            }
        
        return None

