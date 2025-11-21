from api.models import UUIDModel
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator

User = get_user_model()


# Create your views here.
class Author(UUIDModel):
    first_name = models.CharField("Имя", max_length=25, null=False)
    last_name = models.CharField("Фамилия", max_length=25, null=False)
    middle_name = models.CharField("Отчество", max_length=25, null=False)
    # image = models.ImageField("Изображение", upload_to="books", null=True)

class Genre(UUIDModel):
    title = models.CharField("Название", max_length=50, null=False)
    description = models.TextField("Описание", max_length=200, null=True)



class Book(UUIDModel):
    title = models.CharField("Название", max_length=50, null=False)
    authors = models.ManyToManyField(
        Author,
        related_name="books",
        related_query_name="authors",
        verbose_name="Авторы"
    )
    genres = models.ManyToManyField(
        Genre,
        related_name="books",
        related_query_name="genres",
        verbose_name="Жанры"
    )
    wishlists = models.ManyToManyField(
        User,
        related_name="wishlist",
        related_query_name="wishlists",
        verbose_name="В избранном"
    )
    description = models.TextField("Описание", max_length=400, null=True)
    image = models.ImageField("Изображение", upload_to="books", null=False)
    age_cap = models.IntegerField("Ограничение по возрасту", null=False, default=0)
    pub_date = models.DateField("Дата издания", null=True)
    # remains ???

class Feedback(UUIDModel):
    body = models.TextField("Тело отзыва", max_length=1000, null=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Автор",
        related_name="feedbacks"
    )
    rate = models.IntegerField("Оценка", validators=[
        MinValueValidator(1),
        MaxValueValidator(5)
    ], null=False)