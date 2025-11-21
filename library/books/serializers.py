from rest_framework import serializers
from .models import Author, Book, Genre

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        exclude = ('created_at', 'wishlists')
        read_only_fields = ('id', 'wishlists')

    def validate_authors_field(self, value):
        if not value:
            raise serializers.ValidationError("Должен быть указан хотя бы 1 автор!")
        return value

    def validate_genres_field(self, value):
        if not value:
            raise serializers.ValidationError("Должен быть указан хотя бы 1 жанр!")
        return value


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        exclude = ('created_at', )
        read_only_fields = ('id', )


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        exclude = ('created_at', )
        read_only_fields = ('id', )


class SwitchSerializer(serializers.Serializer):
    enable = serializers.BooleanField()