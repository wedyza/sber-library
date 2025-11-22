from django.db import models
from django.core.validators import MinValueValidator
# from django.contrib.auth import get_user_model
from api.models import UUIDModel
from users.models import CustomAbstractUser

# Create your models here.
class Coworking(UUIDModel):
    title = models.CharField("Название", max_length=25, null=False)
    image = models.ImageField("Фотография", null=True)
    description = models.TextField("Описание", max_length=400, null=True)
    address = models.CharField("Адрес", max_length=50, null=True)
    spots = models.IntegerField("Мест", null=False, validators=[
        MinValueValidator(0)
    ])


class CoworkingSession(UUIDModel):
    # идёт 1 час для примера
    start_time = models.DateTimeField("Время начала", null=False)
    end_time = models.DateTimeField("Время окончания", null=False)
    coworking = models.ForeignKey(
        Coworking,
        on_delete=models.CASCADE,
        verbose_name="Коворкинг",
        related_name="sessions",
        null=True
    )
    signups = models.ManyToManyField(
        CustomAbstractUser,
        related_name="sessions",
        verbose_name="Записи"
    )

