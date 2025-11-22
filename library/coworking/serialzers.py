from rest_framework import serializers
from .models import Coworking, CoworkingSession
from django.utils import timezone
from datetime import timedelta


class CoworkingSessionSerializer(serializers.ModelSerializer):
    spots_left = serializers.SerializerMethodField('get_spots_left')
    signed_up = serializers.SerializerMethodField("get_signed_up")

    class Meta:
        model = CoworkingSession
        fields = ('id', 'start_time', 'end_time', 'signups', 'spots_left', 'signed_up')

    def get_spots_left(self, obj):
        return obj.coworking.spots - obj.signups.all().count()
    
    def get_signed_up(self, obj):
        user = self.context['request'].user
        if user.is_anonymous:
            return False
        return obj.signups.contains(user)
        


class CoworkingSerializer(serializers.ModelSerializer):
    sessions = serializers.SerializerMethodField("get_sessions")

    class Meta:
        model = Coworking
        fields = ('id', 'title', 'image', 'description', 'address', 'spots', 'sessions')
        read_only_fields = ('id', )

    def get_sessions(self, obj):
        today = timezone.now().date()
        sessions = {}
        for day in range(8):
            sessions[today.strftime("%d.%m")] = CoworkingSessionSerializer(instance=CoworkingSession.objects.filter(start_time__gte=today).filter(end_time__lte=today + timedelta(days=1)).all().order_by('start_time'), many=True, context=self.context).data
            today = today + timedelta(days=1)
        return sessions
