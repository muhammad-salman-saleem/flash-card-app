from rest_framework import serializers
from .models import TermsAndConditions


class TermsAndConditionsSerializer(serializers.ModelSerializer):


    class Meta:
        model = TermsAndConditions
        fields = [
            "id",
            "body",
            "author",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id"]



