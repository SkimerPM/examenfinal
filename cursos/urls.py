from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FacultadViewSet, CursoViewSet

router = DefaultRouter()
router.register(r'facultades', FacultadViewSet)
router.register(r'cursos', CursoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
