"""
Organization subscription-state transitions.

Kept isolated from `core` and `superadmin` (CLAUDE.md engineering
constraints): this is the single place that mutates
`Organization.subscription_status`, shared by the Lemon Squeezy webhook
handler (`billing.views`) and the super-admin manual "Suspend" action
(`superadmin.views`) so both paths behave identically.
"""

from core.models import Organization


def suspend_organization(organization: Organization) -> Organization:
    organization.subscription_status = Organization.SubscriptionStatus.SUSPENDED
    organization.save(update_fields=["subscription_status", "updated_at"])
    return organization
