import urllib3
import time
import base64
import json
from locale import currency
import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from users.models import Profile
from rest_framework.permissions import IsAuthenticated, AllowAny

def _calculate_order_amount(data):
    # Replace this constant with a calculation of the order's amount
    # Calculate the order total on the server to prevent
    # people from directly manipulating the amount on the client
    return int(float(data["product"]["amount"]) * 100)


class PaymentViewSet(ViewSet):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=["POST"], detail=False)
    def create_customer(self, request):
        email = request.user.email
        profile = Profile.objects.get(user=request.user)
        if profile:
            data = Profile.objects.get(user=request.user)
            if data.stripe_customer_id is None:
                customer = stripe.Customer.create(
                    description="Customer for {}".format(email), email=email
                )
                stripe_id = customer.stripe_id
                new_customer = Profile.objects.filter(user=request.user)
                new_customer.update(stripe_customer_id=stripe_id)
                return Response(
                    "Stripe Id for customer is created", status=status.HTTP_201_CREATED
                )
            return Response(
                "Provided user has Stripe Customer ID", status=status.HTTP_200_OK
            )
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=["GET"])
    def get_subscription_prices(self, request):
        try:

            monthly_price = stripe.Price.retrieve(settings.STRIPE_PRODUCT_MONTHLY_PRICE)
            yearly_price = stripe.Price.retrieve(settings.STRIPE_PRODUCT_YEARLY_PRICE)

            currency_symbol = (
                "$"
                if monthly_price["currency"] == "usd"
                else monthly_price["currency"].upper()
            )
            monthly_unit_amount = monthly_price["unit_amount"] / 100
            yearly_unit_amount = yearly_price["unit_amount"] / 100

            return Response(
                {
                    "monthly_price": monthly_unit_amount,
                    "yearly_price": yearly_unit_amount,
                    "currency": currency_symbol,
                },
                status=status.HTTP_200_OK,
            )

        except stripe.error.StripeError as e:
            return Response({"error": e.user_message}, status=e.http_status)

    @action(detail=False, methods=["GET"])
    def get_subscription(self, request):
        try:
            subscription_id = Profile.objects.get(
                user=request.user
            ).stripe_subscription_id
            subscription = stripe.Subscription.retrieve(subscription_id)
            return Response(subscription, status=status.HTTP_200_OK)
        except stripe.error.StripeError as e:
            return Response({"error": e.user_message}, status=e.http_status)

    @action(detail=False, methods=["POST"])
    def create_subscription(self, request):
        print(request.data)
        type = request.data["type"]
        coupon_str = None
        if "coupon" in request.data:
            coupon_str = request.data["coupon"]

        if type not in ["monthly", "yearly"]:
            return Response(
                {"error": "Invalid subscription"}, status=status.HTTP_400_BAD_REQUEST
            )

        price_id = (
            settings.STRIPE_PRODUCT_MONTHLY_PRICE
            if type == "monthly"
            else settings.STRIPE_PRODUCT_YEARLY_PRICE
        )

        customer_id = Profile.objects.get(user=request.user).stripe_customer_id

        try:
            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[
                    {
                        "price": price_id,
                    }
                ],
                payment_behavior="default_incomplete",
                payment_settings={"save_default_payment_method": "on_subscription"},
                expand=["latest_invoice.payment_intent"],
                coupon=coupon_str,
            )

            profile = Profile.objects.get(user=request.user)
            profile.stripe_payment_intent_id = (
                subscription.latest_invoice.payment_intent.id
            )
            profile.is_premium_user = True
            profile.is_free_user = False
            profile.save()

            response = {
                "subscriptionId": subscription.id,
                "clientSecret": subscription.latest_invoice.payment_intent.client_secret,
            }

            return Response(response, status=status.HTTP_200_OK)
        except stripe.error.StripeError as e:
            print(e.user_message)
            return Response(
                {"error": "Unable to create subscription"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["POST"])
    def validate_coupon(self, request):
        coupon_str = request.data["coupon"]

        if not coupon_str:
            return Response(
                {"error": "Please enter a coupon"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            coupon = stripe.Coupon.retrieve(coupon_str)
            return Response(coupon, status=status.HTTP_200_OK)
        except stripe.error.StripeError as e:
            return Response(
                {"error": e.user_message}, status=status.HTTP_400_BAD_REQUEST
            )


class StripeWebhook(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        event_json = json.loads(request.body)
        event_object = event_json["data"]["object"]

        try:
            if event_json["type"] == "payment_intent.succeeded":
                # print("Payment successful.")
                profile = Profile.objects.get(
                    stripe_payment_intent_id=event_object["id"]
                )
                invoice_id = event_object["invoice"]
                stripe.api_key = settings.STRIPE_SECRET_KEY
                invoice = stripe.Invoice.retrieve(invoice_id)
                subscription = invoice["subscription"]
                profile.payment_done = True
                profile.stripe_subscription_id = subscription
                profile.save()

        except Exception as e:
            # Invalid request body
            print(e)
            print("subscription error")

        return HttpResponse(status=200)


class UpdateSubscriptionProfile(ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        subscription = True
        tranaction_data = verify_receipt(data.get("transactionReceipt"))
        if tranaction_data.status == 200:
            responseBody = json.loads(tranaction_data.data)
            response_status = responseBody.get("status")
            if response_status == 0:
                latestReceipt = responseBody.get("latest_receipt_info")[0]
                expire = latestReceipt["purchase_date_ms"]
                curent_time = time.time()
                if int(expire) > curent_time*1000:
                    subscription = True
                profile = Profile.objects.filter(
                    user=request.user
                    ).first()
                if not profile:
                    return HttpResponse({
                        'status': False,
                        "message": "User does not exist."
                        }, status=status.HTTP_400_BAD_REQUEST)
                profile.subscription_expires_ms = latestReceipt.get("original_purchase_date_ms")
                profile.original_transaction_id = latestReceipt.get("original_transaction_id")
                profile.subscription_product_id = latestReceipt.get("product_id")
                profile.app_type = "ios"
                if subscription:
                    profile.payment_done = True
                    profile.is_free_user = False
                    profile.is_premium_user = True
                    profile.subscription = True
                    profile.save()
                return Response({
                    "message": "Subscription Updated successfully.",
                    "success": True
                },
                            status=status.HTTP_200_OK
                            )
            else:
                return Response({
                    "message": "The Receipt couldn'nt be verfied.",
                    "success": False
                    },
                                status=status.HTTP_400_BAD_REQUEST
                                )
        else:
            return Response({
                "message": "The Receipt couldn'nt be verfied.",
                "success": False
                },
                            status=status.HTTP_400_BAD_REQUEST
                                )


def verify_receipt(encoded_receipt):
    url = settings.VERIFY_RECEIPT_PROD
    shared_secret = str(settings.APPLE_SHARED_SECRET_KEY)
    requestBody = {}
    requestBody["receipt-data"] = encoded_receipt

    if shared_secret:
        requestBody["password"] = shared_secret
    http = urllib3.PoolManager()
    response = http.request("POST",
                            url,
                            headers={"content-type": "application/json"},
                            body=json.dumps(requestBody).encode("utf-8")
                            )
    return response


class AppleWebhook(ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        event_json = request.data
        print(":::::::::::::::::EVENT_BODY: ", event_json)
        signed_payload = event_json['signedPayload'].split(".")[1]
        print(":::::::::::::::::SIGNED_PAYLOAD: ", signed_payload)
        payload = decodeBase64(signed_payload)
        print(":::::::::::::::::DECODED_PAYLOAD: ", payload)
        # notification_type = payload["notificationType"]
        notification_type = payload.get("notificationType")
        print(":::::::::::::::::NOTIFICATION_TYPE: ", notification_type)
        data = payload.get("data")

        if data.get("SignedRenewalInfo") is not None:
            SignedRenewalInfo = decodeBase64(data.get("SignedRenewalInfo").split(".")[1])
            print(":::::::::::::::::::::::::::SIGNED_RENEWAL_INFO", SignedRenewalInfo)
            AutoRenewProductid = SignedRenewalInfo.get("AutoRenewProductid")
            AutoRenewStatus = SignedRenewalInfo.get("AutoRenewStatus")
            ExpirationIntent = SignedRenewalInfo.get("ExpirationIntent")
            GracePeriodExpiresDate = SignedRenewalInfo.get("GracePeriodExpiresDate")
            IsInBillingRetryPeriodOfferIdentifier = SignedRenewalInfo.get("IsInBillingRetryPeriodOfferIdentifier")
            OfferType = SignedRenewalInfo.get("OfferType")
            OriginalTransactionld = SignedRenewalInfo.get("OriginalTransactionld")
            PriceIncreaseStatus = SignedRenewalInfo.get("PriceIncreaseStatus")
            Productid = SignedRenewalInfo.get("Productid")
            SignatureDate = SignedRenewalInfo.get("SignatureDate")

        if data.get("SignedTransactionInfo") is not None:
            SignedTransactionInfo = decodeBase64(data.get("SignedTransactionInfo").split(".")[1])
            print("::::::::::::::::::::::::::::::::SIGNED_TRANSACTION_INFO", SignedTransactionInfo)
            AppAccountToken = SignedTransactionInfo.get("AppAccountToken")
            Bundleld = SignedTransactionInfo.get("Bundleld")
            ExpiresDate = SignedTransactionInfo.get("ExpiresDate")
            InAppOwnershipType = SignedTransactionInfo.get("InAppOwnershipType")
            IsUpgraded = SignedTransactionInfo.get("IsUpgraded")
            OfferIdentifier = SignedTransactionInfo.get("OfferIdentifier")
            OfferType = SignedTransactionInfo.get("OfferType")
            OriginalPurchaseDate = SignedTransactionInfo.get("OriginalPurchaseDate")
            OriginalTransactionld = SignedTransactionInfo.get("OriginalTransactionld")
            ProductId = SignedTransactionInfo.get("ProductId")
            PurchaseDate = SignedTransactionInfo.get("PurchaseDate")
            Quantity = SignedTransactionInfo.get("Quantity")
            RevocationDate = SignedTransactionInfo.get("RevocationDate")
            RevocationReason = SignedTransactionInfo.get("RevocationReason")
            SignatureDate = SignedTransactionInfo.get("SignatureDate")
        if notification_type == "INITIAL_BUY":
            original_transaction_id = ""
            purchase_date_ms = ""
            web_order_line_item_id = ""
            product_id = ""
        elif notification_type == "INTERACTIVE_RENEWAL":
            original_transaction_id = ""
            purchase_date_ms = ""
            web_order_line_item_id = ""
            product_id = ""
        elif notification_type == "DID_CHANGE_RENEWAL_PREF":
            auto_renew_product_id=""
            original_transaction_id=""
        elif notification_type == "CANCEL":
            cancellation_date_ms = ""
            product_id = ""
        elif notification_type == "DID_CHANGE_RENEWAL":
            auto_renew_status_change_date_ms = ""
            auto_renew_status = ""
            original_transaction_id = ""
            product_id = ""
        elif notification_type == "DID_FAIL_TO_RENEW":
            original_transaction_id = ""
            expires_date = ""
            is_in_billing_retry_period = ""
        elif notification_type == "DID_RECOVER":
            purchase_date_ms = ""
            expires_date = ""
            original_transaction_id = ""
        return Response({"status": True}, status=status.HTTP_200_OK)

def decodeBase64(data):
    padding_length = len(data) % 4
    data += '=' * (4 - padding_length)
    payload = json.loads(base64.b64decode(data).decode('utf-8'))
    return payload