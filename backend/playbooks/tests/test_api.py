import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from core.factories import OrganizationFactory
from playbooks.factories import PlaybookFactory
from playbooks.models import Playbook

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    return APIClient()


def test_list_only_returns_playbooks_from_resolved_organization(api_client):
    org_a = OrganizationFactory()
    org_b = OrganizationFactory()
    PlaybookFactory.create_batch(2, organization=org_a)
    PlaybookFactory.create_batch(3, organization=org_b)

    response = api_client.get(reverse("playbook-list"))

    assert response.status_code == 200
    returned_ids = {row["id"] for row in response.data["results"]}
    expected_ids = {str(p.id) for p in org_a.playbooks.all()}
    assert returned_ids == expected_ids
    assert len(returned_ids) == 2


def test_create_playbook_stamps_resolved_organization(api_client):
    org = OrganizationFactory()
    payload = {
        "name": "90-Day Renewal Prep",
        "description": "Prep for upcoming renewal.",
        "trigger": "Renewal date in 90 days",
        "status": Playbook.Status.ACTIVE,
        "steps": ["Check usage", "Schedule call"],
    }

    response = api_client.post(reverse("playbook-list"), payload, format="json")

    assert response.status_code == 201
    created = Playbook.objects.get(id=response.data["id"])
    assert created.organization_id == org.id
    assert created.steps == ["Check usage", "Schedule call"]


def test_soft_deleted_playbook_is_not_retrievable(api_client):
    playbook = PlaybookFactory()
    playbook.delete()

    response = api_client.get(reverse("playbook-detail", args=[playbook.id]))

    assert response.status_code == 404
