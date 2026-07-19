from rest_framework.viewsets import ModelViewSet

from core.mixins import IdempotencyKeyMixin
from core.tenancy import resolve_organization, resolve_write_organization
from notes.models import AccountNote
from notes.serializers import AccountNoteSerializer


class AccountNoteViewSet(IdempotencyKeyMixin, ModelViewSet):
    queryset = AccountNote.objects.select_related("customer", "author")
    serializer_class = AccountNoteSerializer
    filterset_fields = ["customer"]

    def get_queryset(self):
        queryset = super().get_queryset()
        organization = resolve_organization(self.request)
        if organization is None:
            return queryset.none()
        return queryset.filter(organization=organization)

    def perform_create(self, serializer):
        user = self.request.user
        author = user if getattr(user, "is_authenticated", False) else None
        serializer.save(organization=resolve_write_organization(self.request), author=author)
