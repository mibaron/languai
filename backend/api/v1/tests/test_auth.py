import pytest
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from apps.packs.tests.factories import UserFactory

User = get_user_model()


@pytest.fixture
def user_with_password():
    return UserFactory(password="oldpass123")


@pytest.fixture
def auth_client_with_token(user_with_password):
    client = APIClient()
    token, _ = Token.objects.get_or_create(user=user_with_password)
    client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return client, token


# ── Profile (GET/PATCH /auth/me/) ──────────────────


@pytest.mark.django_db
def test_me_returns_name_and_language_fields(auth_client, user):
    response = auth_client.get("/api/v1/auth/me/")
    assert response.status_code == 200
    assert "first_name" in response.data
    assert "last_name" in response.data
    assert "learning_language" in response.data
    assert "native_language" in response.data


@pytest.mark.django_db
def test_me_patch_updates_name(auth_client, user):
    response = auth_client.patch(
        "/api/v1/auth/me/",
        {"first_name": "Jane", "last_name": "Doe"},
        format="json",
    )
    assert response.status_code == 200
    user.refresh_from_db()
    assert user.first_name == "Jane"
    assert user.last_name == "Doe"


@pytest.mark.django_db
def test_me_patch_updates_learning_language(auth_client, user):
    response = auth_client.patch(
        "/api/v1/auth/me/",
        {"learning_language": "fr"},
        format="json",
    )
    assert response.status_code == 200
    user.refresh_from_db()
    assert user.learning_language == "fr"


# ── Change Password ──────────────────


@pytest.mark.django_db
def test_change_password_success(auth_client_with_token, user_with_password):
    client, old_token = auth_client_with_token
    response = client.post(
        "/api/v1/auth/change-password/",
        {"old_password": "oldpass123", "new_password": "newpass456"},
        format="json",
    )
    assert response.status_code == 200
    assert "token" in response.data
    assert response.data["token"] != old_token.key

    user_with_password.refresh_from_db()
    assert user_with_password.check_password("newpass456")


@pytest.mark.django_db
def test_change_password_wrong_old_password(auth_client_with_token):
    client, _ = auth_client_with_token
    response = client.post(
        "/api/v1/auth/change-password/",
        {"old_password": "wrong", "new_password": "newpass456"},
        format="json",
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_change_password_requires_auth(api_client):
    response = api_client.post(
        "/api/v1/auth/change-password/",
        {"old_password": "old", "new_password": "newpass456"},
        format="json",
    )
    assert response.status_code in (401, 403)


# ── Delete Account ──────────────────


@pytest.mark.django_db
def test_delete_account(auth_client, user):
    user_id = user.id
    response = auth_client.delete("/api/v1/auth/me/")
    assert response.status_code == 204
    assert not User.objects.filter(id=user_id).exists()


@pytest.mark.django_db
def test_delete_account_requires_auth(api_client):
    response = api_client.delete("/api/v1/auth/me/")
    assert response.status_code in (401, 403)


# ── Forgot Password ──────────────────


@pytest.mark.django_db
def test_forgot_password_returns_200_for_existing_email(api_client, user):
    response = api_client.post(
        "/api/v1/auth/forgot-password/",
        {"email": user.email},
        format="json",
    )
    assert response.status_code == 200


@pytest.mark.django_db
def test_forgot_password_returns_200_for_nonexistent_email(api_client):
    response = api_client.post(
        "/api/v1/auth/forgot-password/",
        {"email": "nobody@example.com"},
        format="json",
    )
    assert response.status_code == 200


# ── Reset Password ──────────────────


@pytest.mark.django_db
def test_reset_password_with_valid_token(api_client):
    from django.contrib.auth.tokens import default_token_generator
    from django.utils.encoding import force_bytes
    from django.utils.http import urlsafe_base64_encode

    user = UserFactory(password="oldpass")
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    response = api_client.post(
        "/api/v1/auth/reset-password/",
        {"uid": uid, "token": token, "new_password": "brandnew123"},
        format="json",
    )
    assert response.status_code == 204

    user.refresh_from_db()
    assert user.check_password("brandnew123")


@pytest.mark.django_db
def test_reset_password_with_invalid_token(api_client):
    user = UserFactory()
    from django.utils.encoding import force_bytes
    from django.utils.http import urlsafe_base64_encode

    uid = urlsafe_base64_encode(force_bytes(user.pk))

    response = api_client.post(
        "/api/v1/auth/reset-password/",
        {"uid": uid, "token": "invalid-token", "new_password": "brandnew123"},
        format="json",
    )
    assert response.status_code == 400
