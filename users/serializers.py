from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    # El password no se debe devolver en las respuestas de la API
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username','email','password']
    
    def validate_username(self, value: str):
        v = (value or '').strip()
        if not v:
            raise serializers.ValidationError('Error al validar Username. Asegurese que Username no este Vacio')
        return v
    
    def validate_email(self, value:str):
        v = (value or '').strip()

        if not v:
            raise serializers.ValidationError('Error al validar email, Asegurese que el campo de email no este vacio')
        return v
    
class RegisterSerializer(serializers.ModelSerializer):
    
    # El password no se debe devolver en las respuestas de la API
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)