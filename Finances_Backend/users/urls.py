from django.urls import path
from .views import UserListCreateAPIView, RegisterAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    
    path('api/usuarios/', UserListCreateAPIView.as_view(), name='user-list-create'),
    path('api/register/', RegisterAPIView.as_view(), name='user-register'),

    # JWT auth endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    ]