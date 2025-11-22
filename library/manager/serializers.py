from rest_framework import serializers
from .models import BookTakeout
from books.serializers import BookSerializer

class BookTakeoutSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = BookTakeout
        fields = ('id', 'user', 'book', 'start_date', 'return_date', 'comment')
        read_only_fields = ('id', 'user')


class BookTakeoutCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookTakeout
        fields = ('id', 'user', 'book', 'comment')