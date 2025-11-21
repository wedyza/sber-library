from django.db import models
import uuid


# Create your models here.
class UUIDModel(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True)
    created_at = models.DateTimeField("Создано", auto_now_add=True, null=False)

    class Meta:
        abstract = True