import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from core.factories import OrganizationFactory
from customers.factories import CustomerFactory
from notes.factories import AccountNoteFactory
from notes.models import AccountNote

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    return APIClient()


def test_list_only_returns_notes_from_resolved_organization(api_client):
    org_a = OrganizationFactory()
    org_b = OrganizationFactory()
    customer_a = CustomerFactory(organization=org_a)
    customer_b = CustomerFactory(organization=org_b)
    AccountNoteFactory.create_batch(2, customer=customer_a)
    AccountNoteFactory.create_batch(3, customer=customer_b)

    response = api_client.get(reverse("note-list"))

    assert response.status_code == 200
    returned_ids = {row["id"] for row in response.data["results"]}
    expected_ids = {str(n.id) for n in org_a.account_notes.all()}
    assert returned_ids == expected_ids
    assert len(returned_ids) == 2


def test_create_note_stamps_resolved_organization(api_client):
    org = OrganizationFactory()
    customer = CustomerFactory(organization=org)
    payload = {"customer": str(customer.id), "body": "Checked in with the champion."}

    response = api_client.post(reverse("note-list"), payload, format="json")

    assert response.status_code == 201
    created = AccountNote.objects.get(id=response.data["id"])
    assert created.organization_id == org.id


def test_create_note_for_cross_org_customer_is_rejected(api_client):
    # The first org created is the earliest-created active org that this
    # anonymous request's resolve_write_organization() falls back to.
    OrganizationFactory()
    other_org = OrganizationFactory()
    customer = CustomerFactory(organization=other_org)
    payload = {"customer": str(customer.id), "body": "Should be rejected."}

    response = api_client.post(reverse("note-list"), payload, format="json")

    assert response.status_code == 400
    assert "customer" in response.data


def test_soft_deleted_note_is_not_retrievable(api_client):
    note = AccountNoteFactory()
    note.delete()

    response = api_client.get(reverse("note-detail", args=[note.id]))

    assert response.status_code == 404


def test_idempotency_key_replays_cached_response_on_duplicate_post(api_client):
    org = OrganizationFactory()
    customer = CustomerFactory(organization=org)
    payload = {"customer": str(customer.id), "body": "Idempotent note."}
    headers = {"HTTP_IDEMPOTENCY_KEY": "note-req-123"}

    first = api_client.post(reverse("note-list"), payload, format="json", **headers)
    second = api_client.post(reverse("note-list"), payload, format="json", **headers)

    assert first.status_code == 201
    assert second.status_code == 201
    assert first.data["id"] == second.data["id"]
    assert AccountNote.all_objects.filter(body="Idempotent note.").count() == 1
