from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator, MaxValueValidator, MinValueValidator
import uuid
from events.models import Event


class UserManager(BaseUserManager):  # pragma: no cover
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, admin=False, **extra_fields):
        if not email:
            raise ValueError("Должна быть почта")

        self.email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.is_active = True
        if admin:
            user.user_type = CustomAbstractUser.UserType.ADMIN
        user.save()
        return user

    def create_user(self, email, **extra_fields):
        return self._create_user(email, **extra_fields)

    def create_superuser(self, email, **extra_fields):
        return self._create_user(email, True, **extra_fields)


class CustomAbstractUser(AbstractUser):
    class UserType(models.TextChoices):
        VISITOR = "Читатель"
        ADMIN = "Администратор"
        MANAGER = "Библиотекарь"
    
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True)
    username = None
    USERNAME_FIELD = "email"
    objects = UserManager()
    email = models.EmailField(unique=True)
    last_login = None
    otp = models.CharField(max_length=6, null=True, blank=True)
    avatar = models.ImageField("Аватар", upload_to="avatars", null=True)
    REQUIRED_FIELDS = []
    otp_expires = models.DateTimeField("Время жизни otp", null=True, blank=True)
    is_superuser = None
    is_staff = None
    # is_active = None
    date_joined = None
    first_name = models.CharField("Имя", max_length=30, null=False)
    last_name = models.CharField("Фамилия", max_length=30, null=False)
    middle_name = models.CharField("Отчество", max_length=30, null=True)
    user_type = models.TextField("Тип пользователя", choices=UserType.choices, default=UserType.VISITOR)
    birth_date = models.DateField("Дата рождения", null=False)
    lib_code = models.CharField('Номер читательского билета', unique=True, null=False,
            validators=[RegexValidator(
                regex=r'^\d{8}$',
                message='Введите уникальное число из 8 цифр',
                code='invalid_eight_digit_number'
            )])
    password = None

    events = models.ManyToManyField(
        Event,
        related_name="participants",
        related_query_name="events",
        verbose_name="Мероприятия"
    )

    def __str__(self):
        return self.email
