from rest_framework import serializers

from core.models import Organization


class OrganizationAdminSerializer(serializers.ModelSerializer):
    subscription_status_display = serializers.CharField(
        source="get_subscription_status_display", read_only=True
    )
    customer_count = serializers.IntegerField(read_only=True)
    user_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Organization
        fields = [
            "id",
            "name",
            "slug",
            "is_active",
            "subscription_status",
            "subscription_status_display",
            "customer_count",
            "user_count",
            "created_at",
        ]
        read_only_fields = fields
