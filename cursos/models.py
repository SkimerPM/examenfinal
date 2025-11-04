from django.db import models

# Create your models here.

class Facultad(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='facultad_img/')
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class Curso(models.Model):
    nombre = models.CharField(max_length=100)
    horario = models.CharField(max_length=50)
    creditos = models.IntegerField()
    imagen = models.ImageField(upload_to='curso_img/')
    facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE, related_name='cursos')

    def __str__(self):
        return self.nombre