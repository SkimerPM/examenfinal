# backend/storages.py
from django.core.files.storage import Storage
from django.core.files.base import ContentFile
from django.utils.deconstruct import deconstructible
import cloudinary
import cloudinary.uploader
import cloudinary.api


@deconstructible
class CloudinaryMediaStorage(Storage):
    """Custom storage for Cloudinary compatible with Django 5.2+"""
    
    def _open(self, name, mode='rb'):
        """Open a file"""
        return ContentFile(b'')
    
    def _save(self, name, content):
        """Save file to Cloudinary"""
        try:
            content.seek(0)
            upload_result = cloudinary.uploader.upload(
                content,
                folder="media",
                resource_type="auto",
                overwrite=True
            )
            return upload_result['public_id']
        except Exception as e:
            print(f"Cloudinary upload error: {e}")
            raise
    
    def get_valid_name(self, name):
        """Return valid filename"""
        return name
    
    def get_available_name(self, name, max_length=None):
        """Return available filename"""
        return name
    
    def url(self, name):
        """Return Cloudinary URL"""
        if not name:
            return ''
        return cloudinary.CloudinaryImage(str(name)).build_url()
    
    def exists(self, name):
        """Check if file exists"""
        if not name:
            return False
        try:
            cloudinary.api.resource(str(name))
            return True
        except:
            return False
    
    def size(self, name):
        """Return file size"""
        try:
            resource = cloudinary.api.resource(str(name))
            return resource.get('bytes', 0)
        except:
            return 0
    
    def delete(self, name):
        """Delete file from Cloudinary"""
        if name:
            try:
                cloudinary.uploader.destroy(str(name))
            except:
                pass
