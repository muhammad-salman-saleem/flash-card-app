from resources.serializers import ResourceSerializer
from resources.models import Resource
from rest_framework import viewsets


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    #http_method_names = ["get"]
