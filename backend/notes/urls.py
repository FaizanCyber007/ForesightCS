from rest_framework.routers import DefaultRouter

from notes.views import AccountNoteViewSet

router = DefaultRouter()
router.register("notes", AccountNoteViewSet, basename="note")

urlpatterns = router.urls
