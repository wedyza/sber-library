import os

from celery import Celery
from celery.schedules import crontab
from django.utils import timezone


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "library.settings")
app = Celery("library")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


@app.on_after_finalize.connect # potential
def setup_periodic_tasks(sender: Celery, **kwargs):
    sender.add_periodic_task(
        crontab(hour=0, minute=0),
        generate_another_day.s()
    )


@app.task
def generate_another_day():
    from coworking.models import Coworking, CoworkingSession
    coworkings = Coworking.objects.all()
    today = timezone.now() + timezone.timedelta(days=7)
    today = today.replace(minute=0, second=0, microsecond=0)
    for cwk in coworkings:
        for i in range(8, 18):
            today = today.replace(hour=i)
            CoworkingSession.objects.create(start_time=today, end_time=today + timezone.timedelta(hours=1), coworking=cwk)