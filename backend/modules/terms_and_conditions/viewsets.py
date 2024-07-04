from rest_framework import authentication, permissions
from .models import TermsAndConditions
from .serializers import TermsAndConditionsSerializer
from rest_framework import viewsets


class TermsAndConditionsViewSet(viewsets.ModelViewSet):
    serializer_class = TermsAndConditionsSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = (
        authentication.SessionAuthentication,
        authentication.TokenAuthentication,
    )

   	# This query will only return a single (if it exists) PP string, and that will be 
   	# the most recently updated one that *also* has an active flag. You must set at least
   	# one PP object to active for this to work.
    # This is sliced because of the issues previously encountered with
    # querysets while using .first()
    queryset = TermsAndConditions.objects.filter(is_active=True).order_by('-updated_at')[0:1]
