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


class Biases(models.Model):
    bias_id = models.AutoField(primary_key=True)
    file_info = models.ForeignKey(FileInfo, on_delete=models.CASCADE)
    bias_text = models.CharField(max_length=255)
    audit_response = models.BooleanField(null=True, blank=True)
    reasoning = models.TextField()

    def __str__(self):
        return f"{self.bias_id}: {self.bias_text} - {self.file_info.file_name}"
