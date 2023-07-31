from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from . import models


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    rooms = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = get_user_model()
        fields = [
            'id',
            'username',
            'password',
            'rooms',
        ]

    def create(self, validated_data):
        password = validated_data.get('password')
        hashed_password = make_password(password)
        validated_data['password'] = hashed_password
        return super().create(validated_data)
    
    def get_rooms(self, obj):
        rooms = obj.room_set.all()
        data = RoomForUserSerializer(rooms, many=True).data
        return data
    
class MessageSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    username = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = models.Message
        fields = [
            'id',
            'user',
            'username',
            'room',
            'content',
        ]

    def get_username(self, obj):
        return obj.user.username
    
class RoomSerializer(serializers.ModelSerializer):
    host = serializers.PrimaryKeyRelatedField(read_only=True)
    messages = MessageSerializer(source='get_messages', many=True, read_only=True)
    users = UserSerializer(many=True, read_only=True)
    user = serializers.IntegerField(write_only=True, required=False) # Field to add user
    class Meta:
        model = models.Room
        fields = [
            'id',
            'host',
            'users',
            'messages',
            'user'
        ]
        
class RoomForUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Room
        fields = [
            'id',
            'host',
            'users',
        ]