from rest_framework import serializers
from .models import Category,Transactions

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id','name','type']

    def validate_name(self, value:str):
        v = (value or '').strip()
        if not v:
            raise serializers.ValidationError('Error al validar nombre de la categoria, Asegurese que dicha categoria no este vacia')
        return v

class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transactions
        fields = ['id','amount','category','date','description']

    def validate_category(self, value):

        request = self.context.get('request')
        if request is None or request.user.is_anonymous:
            raise serializers.ValidationError('Usuario no autenticado')
        if hasattr(value, 'user') and value.user != request.user:
            raise serializers.ValidationError('Categoría no pertenece al usuario autenticado')
        return value 
    
    def validate_amount(self, value):
        v = value
        if v is None:
            raise serializers.ValidationError('Error al validar cantidad, el campo no puede estar vacio')
        if v <= 0:
            raise serializers.ValidationError('Error al validar cantidad, no puede ser 0 o un numero negativo')
        return v