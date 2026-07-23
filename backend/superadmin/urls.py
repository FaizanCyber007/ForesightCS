from rest_framework.routers import DefaultRouter

from superadmin.views import OrganizationAdminViewSet

router = DefaultRouter()
router.register("admin/organizations", OrganizationAdminViewSet, basename="admin-organization")

urlpatterns = router.urls
