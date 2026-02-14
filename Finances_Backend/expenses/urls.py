from django.urls import path
from .views import (
    CategoryListCreateAPIView,
    CategoryRetrieveUpdateDestroyAPIView,
    TransactionListCreateAPIView,
    TransactionRetrieveUpdateDestroyAPIView,
    TransactionsTotalAPIView,
)


urlpatterns = [
	path('api/categorias/', CategoryListCreateAPIView.as_view(), name='category-list-create'),
	path('api/categorias/<int:pk>/', CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category-detail'),

    # Transacciones/ Tiene Query Params para filtrar por tipo y últimos 30 días
    path('api/transacciones/', TransactionListCreateAPIView.as_view(), name='transactions-list-create'),
    # type: ?type=income|expense
    # últimos 30 días: ?last_30_days=true
    
    path('api/transacciones/<int:pk>/', TransactionRetrieveUpdateDestroyAPIView.as_view(), name='transactions-detail'),
    path('api/transacciones/total/', TransactionsTotalAPIView.as_view(), name='transactions-total'),
]
