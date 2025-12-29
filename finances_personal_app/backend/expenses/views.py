from rest_framework import generics, permissions
from .models import Category, Transactions
from .serializers import CategorySerializer, TransactionSerializer

class CategoryListCreateAPIView(generics.ListCreateAPIView):
    
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
class CategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    

class TransactionListCreateAPIView(generics.ListCreateAPIView):


    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (Transactions.objects.filter(
            user=self.request.user
        ).select_related('category').order_by('-date')
        )
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
class TransactionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transactions.objects.filter(user=self.request.user)
