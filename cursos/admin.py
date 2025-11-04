from django.contrib import admin

# Register your models here.
from .models import Facultad, Curso

admin.site.register(Facultad)
admin.site.register(Curso)

