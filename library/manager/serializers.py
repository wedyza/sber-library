from rest_framework import serializers
from .models import BookTakeout

class BookTakeoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookTakeout
        fields = '__all__'
        read_only_fields = ('id', 'user', 'book')
