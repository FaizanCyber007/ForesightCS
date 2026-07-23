from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core.mixins import IdempotencyKeyMixin
from core.tenancy import resolve_organization, resolve_write_organization
from rules.models import HealthRule
from rules.serializers import HealthRuleSerializer


class HealthRuleViewSet(IdempotencyKeyMixin, ModelViewSet):
    queryset = HealthRule.objects.select_related("organization")
    serializer_class = HealthRuleSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["weight", "threshold", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = super().get_queryset()
        organization = resolve_organization(self.request)
        if organization is None:
            return queryset.none()
        return queryset.filter(organization=organization)

    def perform_create(self, serializer):
        serializer.save(organization=resolve_write_organization(self.request))

    @action(detail=False, methods=["get"], url_path="metric-types")
    def metric_types(self, request):
        """
        Available HealthRule metric types, sourced from the model's own
        choices so the frontend never hardcodes this dropdown.
        """
        return Response(
            [{"value": value, "label": label} for value, label in HealthRule.MetricType.choices]
        )
