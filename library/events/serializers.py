from rest_framework import serializers
from .models import Event, EventFeedback, EventSignup, Tag

class EventSerializer(serializers.ModelSerializer):
    spots_left = serializers.SerializerMethodField('get_spots_left')
    user_signed_up = serializers.SerializerMethodField('get_user_signed_up')
    visited = serializers.SerializerMethodField('get_visited')

    class Meta:
        model = Event
        # exclude = ('participants',)
        fields = ('id', 'description', 'title', 'spots', 'spots_left', 'time','address',  'user_signed_up', 'image', 'tags', 'visited')
        read_only_fields = ('id',)

    def get_visited(self, obj):
        user = self.context["request"].user
        if user.is_anonymous:
            return False
        return obj.signups.filter(user=user).exists() and obj.signups.filter(user=user).first().visited


    def get_spots_left(self, obj):
        return obj.spots - obj.signups.count()
    

    def get_user_signed_up(self, obj):
        user = self.context["request"].user
        if user.is_anonymous:
            return False
        return obj.signups.filter(user=user).exists()
    

class EventFeedbackSeriazlier(serializers.ModelSerializer):
    class Meta:
        model = EventFeedback
        fields = ('id', 'text', 'event', 'user')
        read_only_fields = ('id', 'user')


class EventSignupSerializer(serializers.ModelSerializer):
    event = EventSerializer()
    class Meta:
        model = EventSignup
        fields = ('event',)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'title')
        read_only_fields = ('id', )
# class EventSignupSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = EventSignup
#         fields = '__all__'
#         read_only_fields = ('id', 'user')