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
    model_name = models.CharField(max_length=255)
    bias_text = models.CharField(max_length=255)
    audit_response = models.BooleanField(null=True, blank=True)
    reasoning = models.TextField()

    def to_dict(self):
        return {
            'bias_id': self.bias_id,
            'file_info': self.file_info.to_dict(),
            'model_name': self.model_name,
            'bias_text': self.bias_text,
            'audit_response': self.audit_response,
            'reasoning': self.reasoning
        }
