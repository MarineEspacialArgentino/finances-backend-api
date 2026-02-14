from rest_framework import generics, permissions
from .models import Category, Transactions
from .serializers import CategorySerializer, TransactionSerializer
from rest_framework.response import Response
from datetime import timedelta as timedelta
from django.utils import timezone
from .services import get_total

class AuthenticatedPermissionMixin:
    permission_classes = [permissions.IsAuthenticated]

class CategorySerializerMixin:
    serializer_class = CategorySerializer

class TransactionSerializerMixin:
    serializer_class = TransactionSerializer

class CategoryListCreateAPIView(AuthenticatedPermissionMixin, CategorySerializerMixin, generics.ListCreateAPIView):

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
class CategoryRetrieveUpdateDestroyAPIView(AuthenticatedPermissionMixin, CategorySerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    

class TransactionListCreateAPIView(AuthenticatedPermissionMixin, TransactionSerializerMixin, generics.ListCreateAPIView,):

    def get_queryset(self,transaction_type=None, last_30_days=False):
        user = self.request.user
        queryset = Transactions.objects.filter(user=user).select_related('category')

        transaction_type = self.request.query_params.get('type')
        last_30_days = self.request.query_params.get('last_30_days','').lower() == 'true'

        VALID_TRANSACTION_TYPES = ['income', 'expense']

        if transaction_type in VALID_TRANSACTION_TYPES:
            queryset = queryset.filter(category__type=transaction_type)

        if last_30_days:
            thirty_days_ago = timezone.now().date() - timedelta(days=30)
            queryset = queryset.filter(date__gte=thirty_days_ago)
        return queryset.order_by('-date')
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
class TransactionRetrieveUpdateDestroyAPIView(AuthenticatedPermissionMixin, TransactionSerializerMixin, generics.RetrieveUpdateDestroyAPIView):

    def get_queryset(self):
        return Transactions.objects.filter(user=self.request.user)
       
class TransactionsTotalAPIView(AuthenticatedPermissionMixin, generics.RetrieveAPIView):

    def retrieve(self, request, *args, **kwargs):
        total = get_total(request.user)
        return Response({'total_amount': total})
    