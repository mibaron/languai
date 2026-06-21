import factory
from decimal import Decimal

from apps.users.voucher_models import Voucher


class VoucherFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Voucher

    code = factory.Sequence(lambda n: f"TEST{n:04d}")
    amount = Decimal("1.00")
