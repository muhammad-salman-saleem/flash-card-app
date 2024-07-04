from django.contrib import admin
from .terms_and_conditions.models import TermsAndConditions
from .privacy_policy.models import PrivacyPolicy

admin.site.register(TermsAndConditions)
admin.site.register(PrivacyPolicy)

