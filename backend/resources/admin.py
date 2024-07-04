from django.contrib import admin
from .models import Resource

class ResourceAdminModel(admin.ModelAdmin):
    list_display = ('id' ,'title', 'body', 'source_link')
    search_fields = ['title', 'body']

admin.site.register(Resource, ResourceAdminModel)