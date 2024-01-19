from django.db import models
import uuid


class FileInfo(models.Model):
    file_name = models.CharField(max_length=255, unique=True)
    location = models.CharField(max_length=255)
    file_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)

    def to_dict(self):
        return {
            'file_name': self.file_name,
            'location': self.location,
            'file_id': str(self.file_id)
        }
