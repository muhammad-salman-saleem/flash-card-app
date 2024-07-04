from re import template
from questions_attempted.models import QuestionsAttempted
from .models import Decks
from questions.models import Question
from rest_framework import serializers


class DecksSerializer(serializers.ModelSerializer):

    total_questions = serializers.SerializerMethodField(method_name="get_questions")
    answered_percentage = serializers.SerializerMethodField(
        method_name="get_questions_answered"
    )
    answered_correct = serializers.SerializerMethodField(
        method_name="get_answered_correct"
    )

    class Meta:
        model = Decks
        fields = [
            "id",
            "category",
            "name",
            "description",
            "is_done",
            "is_free",
            "total_questions",
            "answered_percentage",
            "answered_correct",
        ]

    def get_questions(self, instance):
        return Question.objects.filter(deck__id=instance.id).count()

    def get_questions_answered(self, instance):

        usr = self.context.get("request").user
        questions = QuestionsAttempted.objects.filter(
            deck=instance.id, user=usr
        ).count()

        total_questions = Question.objects.filter(deck__id=instance.id).count()

        if total_questions > 0:
            temp = questions / total_questions * 100
            return temp
        
        return 0


    def get_answered_correct(self, instance):

        usr = self.context.get("request").user
        questions = QuestionsAttempted.objects.filter(
            deck=instance.id, user=usr, user_answer_correct=True
        ).count()

        return questions
