from django.contrib import admin

from notes.models import AccountNote


@admin.register(AccountNote)
class AccountNoteAdmin(admin.ModelAdmin):
    list_display = ("customer", "organization", "author", "created_at")
    list_filter = ("organization",)
    search_fields = ("customer__company_name", "body")
