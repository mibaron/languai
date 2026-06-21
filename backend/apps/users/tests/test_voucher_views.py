from decimal import Decimal

import pytest
from rest_framework.test import APIClient

from apps.packs.tests.factories import UserFactory

from .factories import VoucherFactory

REDEEM_URL = "/api/v1/vouchers/redeem/"


@pytest.fixture
def user():
    return UserFactory(credit_balance=Decimal("0.50"))


@pytest.fixture
def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.mark.django_db
class TestRedeemVoucher:
    def test_redeem_success(self, auth_client, user):
        voucher = VoucherFactory(amount=Decimal("2.00"))
        response = auth_client.post(REDEEM_URL, {"code": voucher.code})
        assert response.status_code == 200
        assert response.data["amount"] == "2.00"
        user.refresh_from_db()
        assert user.credit_balance == Decimal("2.50")
        voucher.refresh_from_db()
        assert voucher.used_by == user
        assert voucher.used_at is not None

    def test_redeem_case_insensitive(self, auth_client, user):
        voucher = VoucherFactory(code="WELCOME")
        response = auth_client.post(REDEEM_URL, {"code": "welcome"})
        assert response.status_code == 200
        voucher.refresh_from_db()
        assert voucher.used_by == user

    def test_redeem_invalid_code(self, auth_client):
        response = auth_client.post(REDEEM_URL, {"code": "DOESNOTEXIST"})
        assert response.status_code == 404
        assert response.data["error"]["code"] == "voucher_not_found"

    def test_redeem_already_used(self, auth_client, user):
        other_user = UserFactory()
        voucher = VoucherFactory(used_by=other_user)
        response = auth_client.post(REDEEM_URL, {"code": voucher.code})
        assert response.status_code == 400
        assert response.data["error"]["code"] == "voucher_already_used"

    def test_redeem_requires_auth(self):
        client = APIClient()
        voucher = VoucherFactory()
        response = client.post(REDEEM_URL, {"code": voucher.code})
        assert response.status_code in (401, 403)

    def test_redeem_empty_code(self, auth_client):
        response = auth_client.post(REDEEM_URL, {"code": ""})
        assert response.status_code == 400

    def test_voucher_cannot_be_reused(self, auth_client, user):
        voucher = VoucherFactory(amount=Decimal("1.00"))
        response1 = auth_client.post(REDEEM_URL, {"code": voucher.code})
        assert response1.status_code == 200
        response2 = auth_client.post(REDEEM_URL, {"code": voucher.code})
        assert response2.status_code == 400
        user.refresh_from_db()
        assert user.credit_balance == Decimal("1.50")


@pytest.mark.django_db
class TestVoucherModel:
    def test_unique_code(self):
        VoucherFactory(code="UNIQUE1")
        with pytest.raises(Exception):
            VoucherFactory(code="UNIQUE1")

    def test_is_used_property(self):
        voucher = VoucherFactory()
        assert not voucher.is_used
        voucher.used_by = UserFactory()
        assert voucher.is_used

    def test_str(self):
        voucher = VoucherFactory(code="ABC123", amount=Decimal("5.00"))
        assert "ABC123" in str(voucher)
        assert "5.00" in str(voucher)
