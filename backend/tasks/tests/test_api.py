import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from core.factories import OrganizationFactory
from customers.factories import CustomerFactory
from tasks.factories import TaskFactory
from tasks.models import Task

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    return APIClient()


def test_list_only_returns_tasks_from_resolved_organization(api_client):
    org_a = OrganizationFactory()
    org_b = OrganizationFactory()
    TaskFactory.create_batch(2, organization=org_a)
    TaskFactory.create_batch(3, organization=org_b)

    response = api_client.get(reverse("task-list"))

    assert response.status_code == 200
    returned_ids = {row["id"] for row in response.data["results"]}
    expected_ids = {str(t.id) for t in org_a.tasks.all()}
    assert returned_ids == expected_ids
    assert len(returned_ids) == 2


def test_create_task_stamps_resolved_organization(api_client):
    OrganizationFactory()
    payload = {
        "title": "Follow up on renewal",
        "priority": Task.Priority.HIGH,
        "status": Task.Status.OPEN,
        "type": Task.TaskType.MANUAL,
        "due_date": "2026-08-01",
    }

    response = api_client.post(reverse("task-list"), payload, format="json")

    assert response.status_code == 201
    assert response.data["type"] == Task.TaskType.MANUAL


def test_update_status_via_patch(api_client):
    task = TaskFactory(status=Task.Status.OPEN)

    response = api_client.patch(
        reverse("task-detail", args=[task.id]), {"status": Task.Status.COMPLETED}, format="json"
    )

    assert response.status_code == 200
    task.refresh_from_db()
    assert task.status == Task.Status.COMPLETED


def test_related_account_reflects_customer_company_name(api_client):
    customer = CustomerFactory(company_name="Acme Co")
    task = TaskFactory(organization=customer.organization, customer=customer)

    response = api_client.get(reverse("task-detail", args=[task.id]))

    assert response.status_code == 200
    assert response.data["related_account"] == "Acme Co"


def test_soft_deleted_task_is_not_retrievable(api_client):
    task = TaskFactory()
    task.delete()

    response = api_client.get(reverse("task-detail", args=[task.id]))

    assert response.status_code == 404
