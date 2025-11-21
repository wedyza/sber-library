from rest_framework import views, viewsets, permissions, status, mixins
from .models import Author, Book, Genre
from .paginators import CustomPagination
from .serializers import AuthorSerializer, BookSerializer, GenreSerializer, SwitchSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth import get_user_model

User = get_user_model()


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = CustomPagination
    permission_classes = (permissions.AllowAny, )

    @action(methods=["POST"], detail=True, url_path="add_to_wishlist", serializer_class=SwitchSerializer, permission_classes=(permissions.IsAuthenticated,))
    def add_to_wishlist(self, request, pk):
        enable = self.get_serializer(data=request.data)

        if not enable.is_valid():
            return Response(enable.errors, status=status.HTTP_400_BAD_REQUEST)
        turn = enable.data["enable"]
        try:
            book = Book.objects.get(pk)
        except:
            return Response({"detail": "not found book with that id"}, status=status.HTTP_404_NOT_FOUND)
        user = self.request.user

        icontains = user.wishlist.contains(book)
        if not icontains and turn:
            user.wishlist.add(book)
        elif icontains and not turn:
            user.wishlist.remove(book)
        
        return Response({"enable": True, "book_id": pk})


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    pagination_class = CustomPagination
    permission_classes = (permissions.AllowAny, )

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter("page_size", openapi.IN_QUERY, type=openapi.TYPE_NUMBER),
            openapi.Parameter("page", openapi.IN_QUERY, type=openapi.TYPE_NUMBER),
        ]
    )
    @action(methods=["GET"], url_path="books", detail=True, serializer_class=BookSerializer)
    def get_books(self, request, pk):
        try:
            author = Author.objects.get(id=pk)
        except:
            return Response({"detail": "No genre with that id!"}, status=status.HTTP_404_NOT_FOUND)
        
        books = author.books.all() #? правильно??
        page = self.paginate_queryset(books)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = (permissions.AllowAny, )
    pagination_class = CustomPagination

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter("page_size", openapi.IN_QUERY, type=openapi.TYPE_NUMBER),
            openapi.Parameter("page", openapi.IN_QUERY, type=openapi.TYPE_NUMBER),
        ]
    )
    @action(methods=["GET"], url_path="books", detail=True, serializer_class=BookSerializer)
    def get_books(self, request, pk):
        try:
            genre = Genre.objects.get(id=pk)
        except:
            return Response({"detail": "No genre with that id!"}, status=status.HTTP_404_NOT_FOUND)
        
        books = genre.books.all() #? правильно??
        page = self.paginate_queryset(books)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)