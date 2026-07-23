from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    """
    Restricts a view to authenticated platform superusers only.

    Unlike tenant-scoped viewsets (Phase 1 auth-bypass, see CLAUDE.md ##7),
    super-admin endpoints return data across every Organization, so the
    fatal-error "data leakage" rule in CLAUDE.md ##1 applies here even
    during Phase 1 -- this permission is intentionally never relaxed.
    """

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_superuser)
