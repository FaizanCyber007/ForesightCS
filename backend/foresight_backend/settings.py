"""
Django settings for foresight_backend project.
"""

from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
    ALLOWED_HOSTS=(list, ["localhost", "127.0.0.1"]),
    CORS_ALLOWED_ORIGINS=(list, ["http://localhost:3000"]),
    DB_CONN_MAX_AGE=(int, 60),
)
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env("ALLOWED_HOSTS")


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "drf_spectacular",
    "django_filters",
    # Local
    "core",
    "customers",
    "rules",
    "superadmin",
    "billing",
    "notes",
    "tasks",
    "playbooks",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "foresight_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "foresight_backend.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases
# ABSOLUTELY NO hardcoded credentials -- everything is read from .env via django-environ.

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env("DB_PORT"),
        "CONN_MAX_AGE": env("DB_CONN_MAX_AGE"),
    }
}


# Custom multi-tenant user model
AUTH_USER_MODEL = "core.CustomUser"
# Django's auth.E003 only recognizes field-level `unique=True`; CustomUser
# instead enforces username uniqueness with a database partial constraint for
# non-deleted (authenticatable) accounts, so soft-deleted users can be reused.
SILENCED_SYSTEM_CHECKS = ["auth.E003"]


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Django REST Framework
# Phase 1 (Core CRUD/ORM): auth backends registered but not enforced globally yet.
# RBAC/permissions are tightened to IsAuthenticated + tenant scoping before staging (see CLAUDE.md).
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    # Phase 1 (Core CRUD/ORM): auth is bypassed globally per CLAUDE.md §4.
    # resolve_organization() / resolve_write_organization() in core/tenancy.py
    # still enforce tenant scoping -- anonymous reads are scoped to the seeded
    # demo org in DEBUG, and anonymous writes are rejected with 403. Full RBAC
    # with IsAuthenticated + JWT will be enforced before staging (CLAUDE.md).
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "core.pagination.StandardPagination",
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "PAGE_SIZE": 25,
}

SPECTACULAR_SETTINGS = {
    "TITLE": "ForesightCS API",
    "DESCRIPTION": "Churn prediction platform for SMB software companies.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# CORS -- frontend (Next.js) origin(s) only, read from .env.
CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS")

# Lemon Squeezy billing webhooks (billing app) -- verifies the `X-Signature`
# header on every incoming webhook. Must be set before that endpoint will
# accept any request; see backend/.env.example.
LEMON_SQUEEZY_WEBHOOK_SECRET = env("LEMON_SQUEEZY_WEBHOOK_SECRET", default="")

# Local dev/demo super-admin account, created by `manage.py seed_demo_data`.
# Lets the Next.js server authenticate to superadmin's Basic-Auth-gated API
# (frontend/services/admin.ts) without a full session/JWT login flow, which
# doesn't exist yet anywhere in this Phase 1 app. Leave unset to skip seeding.
SUPERADMIN_USERNAME = env("DJANGO_SUPERADMIN_USERNAME", default="")
SUPERADMIN_PASSWORD = env("DJANGO_SUPERADMIN_PASSWORD", default="")
