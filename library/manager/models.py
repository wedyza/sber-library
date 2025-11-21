from django.db import models
from django.contrib.auth import get_user_model
from books.models import Book
from api.models import UUIDModel
import uuid
User = get_user_model()

class BookTakeout(UUIDModel):
    user = models.ForeignKey(
        User,
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
    return_date = models.DateField("Дата возврата", null=True)
    returned = models.BooleanField("Возвращено", default=False)
    comment = models.TextField("Комментарий", null=True, max_length=500)
    # extended = models.BooleanField("Продлено", default=False)

# class BookTakeoutExtendRequest(models.Model):
#     takeout = models.ForeignKey(
#         BookTakeout,
#         verbose_name="Вынос",
#         related_name="extend_requests",
#         on_delete=models.CASCADE
#     )
#     reason = models.TextField("Описание причины", max_length=250, null=False)
#     applied = models.BooleanField("Принято", default=False)
#     # applied_by = ??