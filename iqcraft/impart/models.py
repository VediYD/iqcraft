from django.db import models


class FileInfo(models.Model):
    file_name = models.CharField(max_length=255, unique=True)
    processed_info = models.AutoField()

    def to_dict(self):
        return {'file_name': self.file_name, 'processed_info': self.processed_info}