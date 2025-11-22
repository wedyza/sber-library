from django.db import models
# from django.contrib.auth import get_user_model
from books.models import Book
from api.models import UUIDModel
from users.models import CustomAbstractUser
class BookTakeout(UUIDModel):
    user = models.ForeignKey(
        CustomAbstractUser,
        verbose_name="Пользователь",
        related_name="takeouts",
        on_delete=models.DO_NOTHING
    )
    book = models.ForeignKey(
        Book,
        verbose_name="Книга",
        related_name="takeouts",
        on_delete=models.DO_NOTHING
    )
    start_date = models.DateField("Дата взятия", null=False)
    return_date = models.DateField("Дата возврата", null=False)
    # returned = models.BooleanField("Возвращено", default=False)
    comment = models.TextField("Комментарий", null=True, max_length=500)
    # extended = models.BooleanField("Продлено", default=False)
