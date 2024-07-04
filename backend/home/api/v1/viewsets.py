import stripe
from allauth import socialaccount
from allauth.socialaccount.models import SocialAccount
from django.http.response import Http404, HttpResponseServerError
from rest_framework import response
from users.models import Profile
from rest_auth.registration.serializers import (
    SocialAccountSerializer,
    SocialConnectSerializer,
    SocialLoginSerializer,
)
from home.models import FAQ
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.contrib.auth import logout, get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.views import APIView
from allauth.socialaccount.providers.apple.views import AppleOAuth2Adapter
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.views import SocialLoginView, SocialConnectView
from allauth.socialaccount.providers.apple.client import AppleOAuth2Client
from rest_framework.parsers import MultiPartParser, FormParser
from allauth.account.models import EmailAddress

from home.api.v1.serializers import (
    CustomSocialAccountSerializer,
    EmptySerializer,
    SignupSerializer,
    UserProfileSerializer,
    UserSerializer,
    CustomAppleConnectSerializer,
    CustomAppleSocialLoginSerializer,
    FAQSerializer,
    SingleUserSerializer,
)

User = get_user_model()

try:
    APP_DOMAIN = f"https://{get_current_site(None)}"
except Exception:
    APP_DOMAIN = ""


class SingleUserView(APIView):
    def get(self, request, format=None):
        _user = User.objects.get(pk=request.user.pk)
        _response = SingleUserSerializer(_user)
        return Response(data=_response.data)


class SocialUserView(APIView):
    def get(self, request, format=None):
        if request.user.is_superuser:
            return Response(data=None)
        try:
            _user = SocialAccount.objects.get(user_id=request.user.pk)

            _response = CustomSocialAccountSerializer(_user)
            return Response(data=_response.data)
        except Exception:
            return Response(data=None)


class FAQView(generics.ListCreateAPIView):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [
        AllowAny,
    ]

class LogoutViewSet(GenericViewSet):
    permission_classes = [
        AllowAny,
    ]
    serializer_class = EmptySerializer

    @action(
        methods=[
            "POST",
        ],
        detail=False,
    )
    def logout(self, request):
        logout(request)
        data = {"success": "Sucessfully logged out"}
        return Response(data=data, status=status.HTTP_200_OK)


class UpdateProfileView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = "user__pk"
    parser_classes = (MultiPartParser, FormParser)

    def get_parsers(self):
        if getattr(self, "swagger_fake_view", False):
            return []

        return super().get_parsers()


class UpdateUserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            new_email = request.data["email"]
            # EmailAddress.objects.add_email(
            #     request, request.user, new_email, confirm=True
            # )
            email_address = EmailAddress.objects.get(user=request.user)
            email_address.email = new_email
            email_address.save()
            serializer.save()

            return Response({"message": "User updated successfully"})
        else:
            return Response({"message": "failed", "details": serializer.errors})


class SignupViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = SignupSerializer
    http_method_names = ["post"]


class LoginViewSet(ViewSet):
    permission_classes = [AllowAny]
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""

    serializer_class = AuthTokenSerializer

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({"token": token.key, "user": user_serializer.data})


class LogoutView(APIView):
    """
    Calls Django logout method and delete the Token object
    assigned to the current User object.
    Accepts/Returns nothing.
    """

    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        return self.logout(request)

    def logout(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, ObjectDoesNotExist):
            pass
        if getattr(settings, "REST_SESSION_LOGIN", True):
            logout(request)

        response = Response(
            {"detail": _("Successfully logged out.")}, status=status.HTTP_200_OK
        )

        if getattr(settings, "REST_USE_JWT", False):
            from rest_framework_jwt.settings import api_settings as jwt_settings

            if jwt_settings.JWT_AUTH_COOKIE:
                response.delete_cookie(jwt_settings.JWT_AUTH_COOKIE)
        return response


class GoogleLogin(SocialLoginView):
    permission_classes = (AllowAny,)
    adapter_class = GoogleOAuth2Adapter
    serializer_class = SocialLoginSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs["context"] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)


class GoogleConnect(SocialConnectView):
    permission_classes = (AllowAny,)
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    serializer_class = SocialConnectSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs["context"] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)


class AppleLogin(SocialLoginView):
    adapter_class = AppleOAuth2Adapter
    client_class = AppleOAuth2Client
    serializer_class = CustomAppleSocialLoginSerializer
    callback_url = f"https://{APP_DOMAIN}/accounts/apple/login/callback/"

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs["context"] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)


class AppleConnect(SocialConnectView):
    adapter_class = AppleOAuth2Adapter
    client_class = AppleOAuth2Client
    serializer_class = CustomAppleConnectSerializer


class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
    serializer_class = SocialLoginSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs["context"] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)


class FacebookConnect(SocialConnectView):
    permission_classes = (AllowAny,)
    adapter_class = FacebookOAuth2Adapter


class DeleteUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user = request.user

        subscription_id = Profile.objects.get(
            user=request.user
        ).stripe_subscription_id
        
        stripe.api_key = settings.STRIPE_SECRET_KEY
        
        if subscription_id:
            try:
                # subscription = stripe.Subscription.retrieve(subscription_id)

                # stripe.Subscription.modify(
                #     subscription_id,
                #     pause_collection={"behavior": "keep_as_draft"},
                # )
                
                subscription = stripe.Subscription.retrieve(subscription_id)
                subscription.delete()
                user.delete()
                return Response({}, status=status.HTTP_200_OK)

                # return Response({"error": "You cannot cancel your account until your subscription is expired. You will not be charged again."}, status=status.HTTP_400_BAD_REQUEST)
            except stripe.error.StripeError as e:
                user.delete()
                return Response({}, status=status.HTTP_200_OK)

        else:
            user.delete()
            return Response({}, status=status.HTTP_200_OK)
