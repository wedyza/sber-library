from django.db import models
from api.models import UUIDModel
from users.models import CustomAbstractUser

class Tag(UUIDModel):
    title = models.CharField('Название', max_length=30, null=False)

class Event(UUIDModel):
    description = models.TextField("Описание", max_length=1000, null=False)
    time = models.DateTimeField("Время и дата начала", null=False)
    #tags/category/genre idk
    title = models.CharField("Название", max_length=100, null=False)
    spots = models.IntegerField("Количество мест", null=False)
    image = models.ImageField("Картинка", upload_to="events", null=True)
    address = models.CharField("Адрес", max_length=150, null=True)
    tags = models.ManyToManyField(
        Tag,
        related_name="events",
        verbose_name="Тэги"
    )

class EventSignup(UUIDModel):
    user = models.ForeignKey(
        CustomAbstractUser,
        related_name='events',
        verbose_name='Пользователь',
        on_delete=models.CASCADE,
        null=False
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='signups',
        verbose_name='Мероприятие',
        null=False
    )
    visited = models.BooleanField("Посещение", default=False)

class EventFeedback(UUIDModel):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='feedbacks',
        verbose_name='Мероприятие',
        null=False
    )
    text = models.TextField('Текст', max_length=500, null=False)
    user = models.ForeignKey(
        CustomAbstractUser,
        related_name='event_feedbacks',
        null=False,
        verbose_name='Пользователь',
        on_delete=models.CASCADE
    )