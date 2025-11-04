from rest_framework import serializers
from .models import Facultad, Curso


class FacultadSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Facultad
        fields = '__all__'
    
    def update(self, instance, validated_data):
        """Manejar actualización de imagen correctamente"""
        # Si no viene imagen en el request, mantener la actual
        if 'imagen' not in validated_data or validated_data.get('imagen') is None:
            validated_data.pop('imagen', None)
        
        # Actualizar el resto de campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class CursoSerializer(serializers.ModelSerializer):
    facultad = serializers.PrimaryKeyRelatedField(queryset=Facultad.objects.all())
    # Si Curso tiene imagen, agrégala aquí también
    imagen = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Curso
        fields = '__all__'
    
    def update(self, instance, validated_data):
        """Manejar actualización de imagen correctamente"""
        # Si no viene imagen en el request, mantener la actual
        if 'imagen' not in validated_data or validated_data.get('imagen') is None:
            validated_data.pop('imagen', None)
        
        # Actualizar el resto de campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
