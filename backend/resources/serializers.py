from resources.models import Resource
from rest_framework import serializers


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = "__all__"
