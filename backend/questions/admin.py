import logging
import csv
from io import StringIO
import zipfile
import os
from pathlib import Path
from typing import Any, Dict, List, Optional
from django.core.files import File

from django.contrib import admin
from django import forms
from django.http.request import HttpRequest
from django.template.response import TemplateResponse
from django.contrib import messages
from django.http.response import HttpResponseRedirect
from django.urls import reverse, path
from django.urls.resolvers import URLPattern

from category.models import Category
from decks.models import Decks
from .models import Question
import sys

logger = logging.getLogger(__name__)


class QuestionsForm(forms.Form):
    csv_file = forms.FileField(
        label="please select a file",
        widget=forms.FileInput(),
    )


class QuestionsAdmin(admin.ModelAdmin):
    list_per_page = sys.maxsize
    def get_urls(self) -> List[URLPattern]:
        urls = super().get_urls()
        _admin_upload_url = [
            path(
                "upload-questions-csv/",
                self.admin_site.admin_view(self.upload_csv),
                name="upload_questions_csv",
            ),
        ]
        return _admin_upload_url + urls

    urls = property(get_urls)

    def changeform_view(
        self,
        request: HttpRequest,
        object_id: Optional[str],
        form_url: str,
        extra_context: Optional[Dict[str, bool]],
    ) -> Any:
        view = super().changeform_view(
            request, object_id=object_id, form_url=form_url, extra_context=extra_context
        )
        if "context_data" in view:
            view.context_data["submit_csv_form"] = QuestionsForm
        return view

    def _handle_csv_file(self, csv_file):
        _file = csv_file
        archive = zipfile.ZipFile(_file, 'r')
        names = archive.namelist()

        parent_dir = ''
        for name in names:
            if not name.startswith('__MACOSX') and name.endswith('data.csv'):
                parent_dir = os.path.dirname(name)
        
        csv_data_file_path = os.path.join(parent_dir, 'data.csv')
        csv_file_data = archive.read(csv_data_file_path).decode("utf-8")
        csv_data = csv.reader(StringIO(csv_file_data), delimiter=",")

        next(csv_data)
        for row in csv_data:
            # create category or get

            category, created = Category.objects.get_or_create(
                name=row[0], description=row[1]
            )

            if created:
                image_file_path = os.path.join(parent_dir, row[2])
                image_file = archive.open(image_file_path, 'r')
                category.image = File(image_file)
                category.save()

            # create decks or get
            is_deck_free = True if row[5] == "Yes" else False
            deck, _ = Decks.objects.get_or_create(
                category=category, name=row[3], description=row[4], is_free=is_deck_free
            )
            # create or get question
            question, _ = Question.objects.get_or_create(
                deck=deck,
                title=row[6],
                description=row[7],
                right_answer=row[8],
            )

    def upload_csv(self, request):
        context = dict(
            # Include common variables for rendering the admin template.
            self.admin_site.each_context(request),
            # Anything else you want in the context...
            # key=value,
            submit_csv_form=QuestionsForm,
        )
        if request.method == "POST":
            form = QuestionsForm(request.POST, request.FILES)
            if form.is_valid():
                self._handle_csv_file(form.cleaned_data["csv_file"])
                messages.add_message(request, messages.INFO, "Added all Questions")
                return HttpResponseRedirect(
                    reverse(
                        f"admin:{self.model._meta.app_label}_{self.model._meta.model_name}_changelist"
                    )
                )
        return TemplateResponse(
            request, "admin/questions/upload_questions.html", context
        )


admin.site.register(Question, QuestionsAdmin)
