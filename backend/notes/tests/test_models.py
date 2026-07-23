import pytest

from notes.factories import AccountNoteFactory
from notes.models import AccountNote

pytestmark = pytest.mark.django_db


def test_soft_delete_excludes_from_default_manager():
    note = AccountNoteFactory()
    note_id = note.id

    note.delete()

    assert not AccountNote.objects.filter(id=note_id).exists()
    assert AccountNote.all_objects.filter(id=note_id).exists()
    assert AccountNote.all_objects.get(id=note_id).deleted_at is not None


def test_str_includes_customer_company_name():
    note = AccountNoteFactory()
    assert note.customer.company_name in str(note)
