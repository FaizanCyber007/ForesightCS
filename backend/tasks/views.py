from rest_framework.viewsets import ModelViewSet

from core.mixins import IdempotencyKeyMixin
from core.tenancy import resolve_organization, resolve_write_organization
from tasks.models import Task
from tasks.serializers import TaskSerializer


class TaskViewSet(IdempotencyKeyMixin, ModelViewSet):
    queryset = Task.objects.select_related("customer", "organization")
    serializer_class = TaskSerializer
    filterset_fields = ["status", "priority", "task_type"]

    def get_queryset(self):
        queryset = super().get_queryset()
        organization = resolve_organization(self.request)
        if organization is None:
            return queryset.none()
        return queryset.filter(organization=organization)

    def perform_create(self, serializer):
        serializer.save(organization=resolve_write_organization(self.request))
