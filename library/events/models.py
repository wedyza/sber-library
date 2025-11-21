from django.db import models
from api.models import UUIDModel

# Create your models here.
class Event(UUIDModel):
    description = models.TextField("Описание", max_length=1000, null=False)
    time = models.DateTimeField("Время и дата начала", null=False)
    #tags/category/genre idk
    title = models.CharField("Название", max_length=100, null=False)
    spots = models.IntegerField("Количество мест", null=False)
    image = models.ImageField("Картинка", upload_to="events", null=False)
