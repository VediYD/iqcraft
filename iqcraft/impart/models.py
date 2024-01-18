from django.db import models


class FileInfo(models.Model):
    file_name = models.CharField(max_length=255, unique=True)
    location = models.CharField(max_length=255)
    file_id = models.CharField(max_length=255)

    def to_dict(self):
        return {
            'file_name': self.file_name,
            'location': self.location,
            'file_id': self.file_id
        }
