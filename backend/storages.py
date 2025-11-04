from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible
import cloudinary
import cloudinary.uploader

@deconstructible
class CloudinaryMediaStorage(Storage):
    
    def _save(self, name, content):
        """Save file to Cloudinary"""
        upload_result = cloudinary.uploader.upload(content)
        return upload_result['public_id']
    
    def url(self, name):
        """Return Cloudinary URL for the file"""
        return cloudinary.CloudinaryImage(name).build_url()
    
    def exists(self, name):
        """Check if file exists"""
        try:
            cloudinary.api.resource(name)
            return True
        except:
            return False
    
    def delete(self, name):
        """Delete file from Cloudinary"""
        cloudinary.uploader.destroy(name)
