from rest_framework import serializers

from playbooks.models import Playbook


class PlaybookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playbook
        fields = [
            "id",
            "name",
            "description",
            "trigger",
            "status",
            "accounts_in_play",
            "last_triggered",
            "steps",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "accounts_in_play", "last_triggered"]
