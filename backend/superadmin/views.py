from django.db.models import Count
from rest_framework.authentication import (
    BasicAuthentication,
    SessionAuthentication,
    TokenAuthentication,
)
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from billing.services import suspend_organization
from core.models import Organization
from superadmin.permissions import IsSuperUser
from superadmin.serializers import OrganizationAdminSerializer


class OrganizationAdminViewSet(ReadOnlyModelViewSet):
    """
    Cross-tenant Organization directory for platform superusers.

    Deliberately does NOT go through `core.tenancy.resolve_organization` --
    that helper scopes to *one* tenant, while this is the one surface in the
    platform meant to see every tenant at once (CLAUDE.md ##1 Super Admin
    Bypass), gated by `IsSuperUser` instead of query scoping.

    Adds `BasicAuthentication` on top of the project defaults so the Next.js
    server can call this endpoint as the seeded super-admin account (see
    `customers.management.commands.seed_demo_data` and frontend/services/admin.ts)
    without a full session/JWT login flow -- there is no such flow anywhere
    in this Phase 1 app yet. Scoped to this viewset only, not project-wide.
    """

    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    permission_classes = [IsSuperUser]
    serializer_class = OrganizationAdminSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name", "slug"]
    ordering_fields = ["name", "created_at", "subscription_status"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Organization.objects.annotate(
            customer_count=Count("customers", distinct=True),
            user_count=Count("users", distinct=True),
        )

    @action(detail=True, methods=["post"], url_path="suspend")
    def suspend(self, request, pk=None):
        """Manual override mirroring the Lemon Squeezy `subscription_payment_failed` handler."""
        organization = suspend_organization(self.get_object())
        serializer = self.get_serializer(organization)
        return Response(serializer.data)
