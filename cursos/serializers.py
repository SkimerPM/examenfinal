from rest_framework import serializers
from .models import Facultad, Curso

class FacultadSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(required=False)
    class Meta:
        model = Facultad
        fields = '__all__'

class CursoSerializer(serializers.ModelSerializer):
    facultad = serializers.PrimaryKeyRelatedField(queryset=Facultad.objects.all())
    
    class Meta:
        model = Curso
        fields = '__all__'