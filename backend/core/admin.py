from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from core.models import CustomUser, Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "subscription_status", "is_active", "created_at")
    list_filter = ("subscription_status", "is_active")
    search_fields = ("name", "slug", "lemon_squeezy_customer_id")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (("Tenant", {"fields": ("organization", "is_org_admin")}),)
    list_display = UserAdmin.list_display + ("organization", "is_org_admin")
    list_filter = UserAdmin.list_filter + ("organization", "is_org_admin")
