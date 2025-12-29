from django.urls import path
from .views import CategoryListCreateAPIView, CategoryRetrieveUpdateDestroyAPIView,TransactionListCreateAPIView,TransactionRetrieveUpdateDestroyAPIView


urlpatterns = [
	path('api/categorias/', CategoryListCreateAPIView.as_view(), name='category-list-create'),
	path('api/categorias/<int:pk>/', CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category-detail'),
    path('api/transacciones/', TransactionListCreateAPIView.as_view(), name='transactions-list-create'),
    path('api/transacciones/<int:pk>/', TransactionRetrieveUpdateDestroyAPIView.as_view(), name='transactions-detail'),
]
