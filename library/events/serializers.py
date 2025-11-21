from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    spots_left = serializers.SerializerMethodField('get_spots_left')
    user_signed_up = serializers.SerializerMethodField('get_user_signed_up')

    class Meta:
        model = Event
        # exclude = ('participants',)
        fields = ('id', 'description', 'title', 'spots', 'spots_left', 'time', 'user_signed_up') # тут добавить left_spots
        read_only_fields = ('id',)

    def get_spots_left(self, obj):
        return obj.spots - obj.participants.count()
    

    def get_user_signed_up(self, obj):
        user = self.context["request"].user
        if user.is_anonymous:
            return False
        return obj.participants.contains(user)
# class EventSignupSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = EventSignup
#         fields = '__all__'
#         read_only_fields = ('id', 'user')