from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer, RegisterSerializer


class UserListCreateAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class RegisterAPIView(APIView):
    
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message':'Usuario Creado Exitosamente'},
                status=status.HTTP_201_CREATED
                )
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)