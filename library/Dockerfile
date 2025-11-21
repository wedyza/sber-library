FROM python:3.12

WORKDIR /app

RUN pip install gunicorn==20.1.0

COPY requirements.txt .

RUN pip install -r requirements.txt --no-cache-dir

COPY . .

# Потом заменить возможно на asgi
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "library.wsgi"]