from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from celery import shared_task
from django.template.loader import render_to_string

def multitasker(f): #Позволяет не бегать туда сюда и менять лишь 1 значение
    """
    Декоратор, который управляет запуском тасков
    Если settings.CONTAINER_LAUNCHER = True, то запускает их в Celery Worker,
    Иначе как обычную функцию
    """
    def wrapper(*args, **kwargs):
        if settings.CONTAINER_LAUNCHER:
            return f.delay(*args, **kwargs)
        return f(*args, **kwargs)
    return wrapper

@multitasker
@shared_task
def send_otp_email(email, otp):
    """
    Отправляет письмо на почту соответственно
    """
    subject = "Your OTP for Login"
    message = f"Your OTP is: {otp}"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    msg = EmailMultiAlternatives(subject, message, from_email, recipient_list)

    html_content = render_to_string(
        "email_otp.html", {"site_name": "Библиотека №14", "OTP": otp}
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send()
