from rest_framework import serializers
from .models import Author, Book, Genre
from manager.models import BookTakeout

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        exclude = ('created_at', )
        read_only_fields = ('id', )


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        exclude = ('created_at', )
        read_only_fields = ('id', )

class BookSerializer(serializers.ModelSerializer):
    in_wishlist = serializers.SerializerMethodField('get_in_wishlist')
    readed = serializers.SerializerMethodField('get_readed')
    authors_detail = AuthorSerializer(source='authors', read_only=True, many=True)
    genres_detail = GenreSerializer(source='genres', read_only=True, many=True)

    authors = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all(),many=True, write_only=True)
    genres = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all(),many=True, write_only=True)
    class Meta:
        model = Book
        fields = ('id', 'title', 'authors', 'genres', 'description', 'image', 'in_wishlist', 'readed', 'authors_detail', 'genres_detail')
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


class SwitchSerializer(serializers.Serializer):
    enable = serializers.BooleanField()