import hashlib
import hmac
import logging

from django.conf import settings
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from billing.services import suspend_organization
from core.models import Organization

logger = logging.getLogger(__name__)

SUBSCRIPTION_PAYMENT_FAILED = "subscription_payment_failed"


class LemonSqueezyWebhookView(APIView):
    """
    Receives Lemon Squeezy billing webhooks.

    Every request's `X-Signature` is verified against
    `settings.LEMON_SQUEEZY_WEBHOOK_SECRET` before the payload is trusted
    (CLAUDE.md ##3 Front-to-Back Symmetry & Idempotency -- critical POSTs
    must be safe against replay/spoofing). Only `subscription_payment_failed`
    is acted on; other recognized event types are accepted (200) and ignored
    so Lemon Squeezy doesn't retry-storm us for events we don't yet handle.
    """

    permission_classes = [AllowAny]
    authentication_classes = []
    parser_classes = [JSONParser]

    def post(self, request, *args, **kwargs):
        if not self._signature_is_valid(request):
            return Response(
                {"detail": "Invalid webhook signature."}, status=status.HTTP_401_UNAUTHORIZED
            )

        payload = request.data
        event_name = payload.get("meta", {}).get("event_name")

        if event_name == SUBSCRIPTION_PAYMENT_FAILED:
            self._handle_payment_failed(payload)

        return Response(status=status.HTTP_200_OK)

    def _signature_is_valid(self, request) -> bool:
        secret = settings.LEMON_SQUEEZY_WEBHOOK_SECRET
        if not secret:
            logger.error("LEMON_SQUEEZY_WEBHOOK_SECRET is not configured; rejecting webhook.")
            return False

        signature = request.headers.get("X-Signature", "")
        if not signature:
            return False

        digest = hmac.new(secret.encode("utf-8"), request.body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(digest, signature)

    def _handle_payment_failed(self, payload: dict) -> None:
        customer_id = str(payload.get("data", {}).get("attributes", {}).get("customer_id", ""))
        if not customer_id:
            logger.warning(
                "subscription_payment_failed webhook is missing data.attributes.customer_id."
            )
            return

        organization = Organization.objects.filter(lemon_squeezy_customer_id=customer_id).first()
        if organization is None:
            logger.warning("No Organization found for Lemon Squeezy customer_id=%s", customer_id)
            return

        suspend_organization(organization)
