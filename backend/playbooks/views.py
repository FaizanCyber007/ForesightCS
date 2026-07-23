from rest_framework.viewsets import ModelViewSet

from core.mixins import IdempotencyKeyMixin
from core.tenancy import resolve_organization, resolve_write_organization
from playbooks.models import Playbook
from playbooks.serializers import PlaybookSerializer


class PlaybookViewSet(IdempotencyKeyMixin, ModelViewSet):
    queryset = Playbook.objects.select_related("organization")
    serializer_class = PlaybookSerializer
    filterset_fields = ["status"]

    def get_queryset(self):
        queryset = super().get_queryset()
        organization = resolve_organization(self.request)
        if organization is None:
            return queryset.none()
        return queryset.filter(organization=organization)

    def perform_create(self, serializer):
        serializer.save(organization=resolve_write_organization(self.request))
