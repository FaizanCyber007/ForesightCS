import base64

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from core.factories import CustomUserFactory, OrganizationFactory
from customers.factories import CustomerFactory
from customers.models import Customer
from rules.factories import HealthRuleFactory
from rules.models import HealthRule

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    return APIClient()


def test_list_only_returns_customers_from_resolved_organization(api_client):
    org_a = OrganizationFactory()
    org_b = OrganizationFactory()
    CustomerFactory.create_batch(2, organization=org_a)
    CustomerFactory.create_batch(3, organization=org_b)

    response = api_client.get(reverse("customer-list"))

    assert response.status_code == 200
    returned_org_ids = {row["id"] for row in response.data["results"]}
    # Anonymous requests fall back to the earliest-created active org (org_a).
    expected_ids = {str(c.id) for c in org_a.customers.all()}
    assert returned_org_ids == expected_ids
    assert len(returned_org_ids) == 2


def test_superuser_sees_customers_across_all_organizations(api_client):
    org_a = OrganizationFactory()
    org_b = OrganizationFactory()
    CustomerFactory.create_batch(2, organization=org_a)
    CustomerFactory.create_batch(3, organization=org_b)
    superuser = CustomUserFactory(is_superuser=True, organization=None)

    api_client.force_authenticate(user=superuser)
    response = api_client.get(reverse("customer-list"), {"page_size": 200})

    assert response.status_code == 200
    assert response.data["count"] == 5


def test_superuser_via_basic_auth_bypasses_organization_header(api_client):
    """
    The seeded super-admin account (Phase 1 has no JWT flow yet, see
    core.tenancy) can authenticate over HTTP Basic Auth and still bypass
    tenant scoping -- an X-Organization-ID header must NOT narrow a real
    superuser back down to a single tenant.
    """
    org_a = OrganizationFactory()
    org_b = OrganizationFactory()
    CustomerFactory.create_batch(2, organization=org_a)
    CustomerFactory.create_batch(3, organization=org_b)
    superuser = CustomUserFactory(is_superuser=True, organization=None)
    superuser.set_password("s3cret-pass")
    superuser.save()
    credentials = base64.b64encode(f"{superuser.username}:s3cret-pass".encode()).decode()

    api_client.credentials(HTTP_AUTHORIZATION=f"Basic {credentials}")
    response = api_client.get(
        reverse("customer-list"), {"page_size": 200}, HTTP_X_ORGANIZATION_ID=str(org_a.id)
    )

    assert response.status_code == 200
    assert response.data["count"] == 5


def test_list_scopes_to_organization_named_by_header(api_client):
    org_a = OrganizationFactory()
    org_b = OrganizationFactory()
    CustomerFactory.create_batch(2, organization=org_a)
    CustomerFactory.create_batch(3, organization=org_b)

    response = api_client.get(reverse("customer-list"), HTTP_X_ORGANIZATION_ID=str(org_b.id))

    assert response.status_code == 200
    returned_org_ids = {row["id"] for row in response.data["results"]}
    expected_ids = {str(c.id) for c in org_b.customers.all()}
    assert returned_org_ids == expected_ids
    assert len(returned_org_ids) == 3


def test_create_assigns_customer_to_organization_named_by_header(api_client):
    org_a = OrganizationFactory()
    org_b = OrganizationFactory()
    payload = {
        "name": "Jane Doe",
        "company_name": "Header Scoped Co",
        "segment": "SMB",
        "plan": "Starter",
        "health_score": 100,
        "mrr": "1000.00",
        "annual_contract_value": "12000.00",
        "renewal_date": "2027-01-01",
        "nps": 0,
        "expansion_potential": 0,
    }

    response = api_client.post(
        reverse("customer-list"), payload, format="json", HTTP_X_ORGANIZATION_ID=str(org_b.id)
    )

    assert response.status_code == 201
    created = Customer.objects.get(company_name="Header Scoped Co")
    assert created.organization_id == org_b.id
    assert created.organization_id != org_a.id


def test_invalid_organization_header_falls_back_to_default_org(api_client):
    org_a = OrganizationFactory()
    CustomerFactory.create_batch(2, organization=org_a)

    response = api_client.get(reverse("customer-list"), HTTP_X_ORGANIZATION_ID="not-a-real-uuid")

    assert response.status_code == 200
    returned_org_ids = {row["id"] for row in response.data["results"]}
    expected_ids = {str(c.id) for c in org_a.customers.all()}
    assert returned_org_ids == expected_ids


def test_pagination_page_size_query_param(api_client):
    org = OrganizationFactory()
    CustomerFactory.create_batch(5, organization=org)

    response = api_client.get(reverse("customer-list"), {"page_size": 2})

    assert response.status_code == 200
    assert len(response.data["results"]) == 2
    assert response.data["count"] == 5


def test_filter_by_health_tier(api_client):
    org = OrganizationFactory()
    CustomerFactory(organization=org, health_score=90, company_name="Healthy Co")
    CustomerFactory(organization=org, health_score=20, company_name="Critical Co")

    response = api_client.get(reverse("customer-list"), {"health": "Critical"})

    assert response.status_code == 200
    companies = {row["company_name"] for row in response.data["results"]}
    assert companies == {"Critical Co"}


def test_search_by_company_name(api_client):
    org = OrganizationFactory()
    CustomerFactory(organization=org, company_name="Zephyr Robotics")
    CustomerFactory(organization=org, company_name="Nimbus Retail")

    response = api_client.get(reverse("customer-list"), {"search": "Zephyr"})

    assert response.status_code == 200
    assert response.data["count"] == 1
    assert response.data["results"][0]["company_name"] == "Zephyr Robotics"


def test_patch_ignores_client_supplied_health_score(api_client):
    """
    health_score is read-only via the API: per CLAUDE.md's Churn Scoring
    Engine rules, it can only change through HealthScoreEngine (the
    `/calculate/` action), never a direct client-supplied value.
    """
    customer = CustomerFactory(health_score=90)

    response = api_client.patch(
        reverse("customer-detail", args=[customer.id]), {"health_score": 20}, format="json"
    )

    assert response.status_code == 200
    assert response.data["health_score"] == 90
    assert response.data["health"] == Customer.HEALTHY
    customer.refresh_from_db()
    assert customer.health_score == 90


def test_soft_deleted_customer_is_not_retrievable(api_client):
    customer = CustomerFactory()
    customer.delete()

    response = api_client.get(reverse("customer-detail", args=[customer.id]))

    assert response.status_code == 404


def test_calculate_action_recalculates_and_persists_health_score(api_client):
    org = OrganizationFactory()
    customer = CustomerFactory(organization=org, health_score=100, nps=5)
    HealthRuleFactory(
        organization=org, metric_type=HealthRule.MetricType.NPS_RESPONSE, threshold=20, weight=15
    )

    response = api_client.post(reverse("customer-calculate", args=[customer.id]))

    assert response.status_code == 200
    assert response.data["health_score"] == 85
    customer.refresh_from_db()
    assert customer.health_score == 85


def test_calculate_action_only_affects_the_targeted_customer(api_client):
    org = OrganizationFactory()
    target = CustomerFactory(organization=org, health_score=100)
    other = CustomerFactory(organization=org, health_score=100)
    HealthRuleFactory(
        organization=org, metric_type=HealthRule.MetricType.LOGIN, threshold=99, weight=15
    )

    api_client.post(reverse("customer-calculate", args=[target.id]))
    other.refresh_from_db()

    assert other.health_score == 100


def test_calculate_action_returns_404_for_unknown_customer(api_client):
    OrganizationFactory()

    unknown_id = "11111111-1111-1111-1111-111111111111"
    response = api_client.post(reverse("customer-calculate", args=[unknown_id]))

    assert response.status_code == 404


def test_idempotency_key_replays_cached_response_on_duplicate_post(api_client):
    OrganizationFactory()
    payload = {
        "name": "Jane Doe",
        "company_name": "Idempotent Co",
        "segment": "SMB",
        "plan": "Starter",
        "health_score": 100,
        "mrr": "1000.00",
        "annual_contract_value": "12000.00",
        "renewal_date": "2027-01-01",
        "nps": 0,
        "expansion_potential": 0,
    }
    headers = {"HTTP_IDEMPOTENCY_KEY": "req-123"}

    first = api_client.post(reverse("customer-list"), payload, format="json", **headers)
    second = api_client.post(reverse("customer-list"), payload, format="json", **headers)

    assert first.status_code == 201
    assert second.status_code == 201
    assert first.data["id"] == second.data["id"]
    assert Customer.all_objects.filter(company_name="Idempotent Co").count() == 1
