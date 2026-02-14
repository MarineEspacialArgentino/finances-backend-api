from .models import Transactions
from django.db.models import Sum


def get_total(user):
    income_total = Transactions.objects.filter(
        user=user, category__type='income'
    ).aggregate(total_amount=Sum('amount'))['total_amount'] or 0

    expense_total = Transactions.objects.filter(
        user=user, category__type='expense'
    ).aggregate(total_amount=Sum('amount'))['total_amount'] or 0

    return income_total - expense_total

