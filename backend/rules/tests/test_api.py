import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from core.factories import CustomUserFactory, OrganizationFactory
from rules.factories import HealthRuleFactory
from rules.models import HealthRule

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    return APIClient()


def test_list_only_returns_rules_from_resolved_organization(api_client):
    org_a = OrganizationFactory()
    org_b = OrganizationFactory()
    HealthRuleFactory.create_batch(2, organization=org_a)
    HealthRuleFactory.create_batch(3, organization=org_b)

    response = api_client.get(reverse("healthrule-list"))

    assert response.status_code == 200
    returned_ids = {row["id"] for row in response.data["results"]}
    expected_ids = {str(r.id) for r in org_a.health_rules.all()}
    assert returned_ids == expected_ids
    assert len(returned_ids) == 2


def test_superuser_sees_rules_across_all_organizations(api_client):
    org_a = OrganizationFactory()
    org_b = OrganizationFactory()
    HealthRuleFactory.create_batch(2, organization=org_a)
    HealthRuleFactory.create_batch(3, organization=org_b)
    superuser = CustomUserFactory(is_superuser=True, organization=None)

    api_client.force_authenticate(user=superuser)
    response = api_client.get(reverse("healthrule-list"), {"page_size": 200})

    assert response.status_code == 200
    assert response.data["count"] == 5


def test_create_rule_stamps_resolved_organization(api_client):
    org = OrganizationFactory()
    payload = {
        "name": "Login drop watchlist",
        "metric_type": HealthRule.MetricType.LOGIN,
        "threshold": "25.00",
        "weight": 15,
    }

    response = api_client.post(reverse("healthrule-list"), payload, format="json")

    assert response.status_code == 201
    assert response.data["metric_type_display"] == "Login frequency"
    created = HealthRule.objects.get(id=response.data["id"])
    assert created.organization_id == org.id


@pytest.mark.parametrize("weight", [0, -5, 101, 500])
def test_weight_outside_valid_range_is_rejected(api_client, weight):
    OrganizationFactory()
    payload = {
        "name": "Bad weight rule",
        "metric_type": HealthRule.MetricType.SUPPORT_TICKET,
        "threshold": "5.00",
        "weight": weight,
    }

    response = api_client.post(reverse("healthrule-list"), payload, format="json")

    assert response.status_code == 400
    assert "weight" in response.data


def test_negative_threshold_is_rejected(api_client):
    OrganizationFactory()
    payload = {
        "name": "Bad threshold rule",
        "metric_type": HealthRule.MetricType.SUPPORT_TICKET,
        "threshold": "-1.00",
        "weight": 10,
    }

    response = api_client.post(reverse("healthrule-list"), payload, format="json")

    assert response.status_code == 400
    assert "threshold" in response.data


def test_soft_deleted_rule_is_not_retrievable(api_client):
    rule = HealthRuleFactory()
    rule.delete()

    response = api_client.get(reverse("healthrule-detail", args=[rule.id]))

    assert response.status_code == 404


def test_idempotency_key_replays_cached_response_on_duplicate_post(api_client):
    OrganizationFactory()
    payload = {
        "name": "Idempotent rule",
        "metric_type": HealthRule.MetricType.BILLING_ISSUE,
        "threshold": "1.00",
        "weight": 20,
    }
    headers = {"HTTP_IDEMPOTENCY_KEY": "rule-req-123"}

    first = api_client.post(reverse("healthrule-list"), payload, format="json", **headers)
    second = api_client.post(reverse("healthrule-list"), payload, format="json", **headers)

    assert first.status_code == 201
    assert second.status_code == 201
    assert first.data["id"] == second.data["id"]
    assert HealthRule.all_objects.filter(name="Idempotent rule").count() == 1


def test_metric_types_endpoint_lists_model_choices(api_client):
    response = api_client.get(reverse("healthrule-metric-types"))

    assert response.status_code == 200
    values = {row["value"] for row in response.data}
    assert values == {choice.value for choice in HealthRule.MetricType}
