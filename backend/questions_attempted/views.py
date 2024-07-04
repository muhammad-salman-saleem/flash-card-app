import json
from django.http import response
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.response import Response

from .serializers import QuestionsAttemptedSerializer
from .models import QuestionsAttempted, Question


def get_answered_correct(deck, usr):
    return QuestionsAttempted.objects.filter(
        deck=deck, user=usr, user_answer_correct=True
    ).count()


def get_answered_percentage(deck, usr):
    total_questions_answered = QuestionsAttempted.objects.filter(
        deck=deck, user=usr
    ).count()
    total_questions = Question.objects.filter(deck__id=deck).count()

    percentage_answered = 0
    if total_questions > 0:
        percentage_answered = total_questions_answered / total_questions * 100

    return percentage_answered


class QuestionsAttemptedViewSet(viewsets.ViewSet):
    queryset = QuestionsAttempted.objects.all()

    def list(self, request):
        serializer_class = QuestionsAttemptedSerializer(self.queryset, many=True)
        return Response(serializer_class.data, status=HTTP_200_OK)

    def create(self, request):
        serializer = QuestionsAttemptedSerializer(data=request.data)
        if serializer.is_valid():
            que = serializer["question"].value
            ans_correct = serializer["user_answer_correct"].value
            deck = serializer["deck"].value
            usr = serializer["user"].value
            updated_values = {"user_answer_correct": ans_correct}
            try:
                obj = QuestionsAttempted.objects.get(deck=deck, user=usr, question=que)
                for key, value in updated_values.items():
                    setattr(obj, key, value)
                obj.save()
            except QuestionsAttempted.DoesNotExist:
                obj = QuestionsAttempted(
                    deck_id=deck,
                    user_id=usr,
                    question_id=que,
                    user_answer_correct=ans_correct,
                )
                obj.save()

            response_serializer = QuestionsAttemptedSerializer(obj)

            responseObj = response_serializer.data

            responseObj["answered_correct"] = get_answered_correct(deck, usr)
            responseObj["answered_percentage"] = get_answered_percentage(deck, usr)

            return Response(responseObj, status=HTTP_200_OK)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer_class = QuestionsAttemptedSerializer(obj)
        return response.JsonResponse(serializer_class.data, safe=False)

    def destroy(self, request, pk):
        obj = QuestionsAttempted.objects.get(pk=pk)
        obj.delete()
