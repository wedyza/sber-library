from rest_framework import serializers
from .models import Author, Book, Genre
from manager.models import BookTakeout

class BookSerializer(serializers.ModelSerializer):
    in_wishlist = serializers.SerializerMethodField('get_in_wishlist')
    readed = serializers.SerializerMethodField('get_readed')

    class Meta:
        model = Book
        fields = ('id', 'title', 'authors', 'genres', 'description', 'image', 'in_wishlist', 'readed')
        read_only_fields = ('id', 'wishlists')

    def get_readed(self, obj):
        user = self.context['request'].user
        if user.is_anonymous:
            return False
        return BookTakeout.objects.filter(user=user).filter(book=obj).exclude(return_date=None).exists()

    def get_in_wishlist(self, obj):
        user = self.context['request'].user
        if user.is_anonymous:
            return False
        return user.wishlist.contains(obj)

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