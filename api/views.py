from rest_framework.response import Response
from rest_framework.decorators import APIView
from rest_framework.generics import ListCreateAPIView, GenericAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.reverse import reverse

from django.contrib.auth.models import User

from . import serializers
from . import models
from .mixins import AuthenticationRequiredMixin

class HomeView(APIView):
    def get(self, request):
        data = {
            'rooms_url': reverse('rooms', request=request),
            'messages_url': reverse('messages', request=request),
            'users_url': reverse('users', request=request)
        }
        return Response(data)

class UserListCreateView(ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    
class UserGetView(AuthenticationRequiredMixin, GenericAPIView):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        qs = User.objects.filter(id=self.request.user.id)
        return qs

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset[0], many=False)
        return Response(serializer.data)

class RoomListCreateView(AuthenticationRequiredMixin, ListCreateAPIView):
    queryset = models.Room.objects.all()
    serializer_class = serializers.RoomSerializer

    def perform_create(self, serializer):
        host = self.request.user
        if host:
            room = serializer.save(host=host)
            room.users.add(host)
            host.room_set.add(room)
        serializer.save()

class RoomRetrieveUpdateDeleteView(AuthenticationRequiredMixin, RetrieveUpdateDestroyAPIView):
    queryset = models.Room.objects.all()
    serializer_class = serializers.RoomSerializer

    def get(self, request, *args, **kwargs):
        try:
            room = self.get_object()
            room.users.add(request.user)
        except:
            pass
        return super().get(request, *args, **kwargs)

    def perform_update(self, serializer):
        user_id = serializer.validated_data.get('user')
        room = serializer.save()

        if user_id is not None:
            try:
                user = User.objects.get(pk=user_id)
                room.users.add(user)
                user.room_set.add(room)
            except:
                pass
        serializer.save()

class MessageListCreateView(AuthenticationRequiredMixin, ListCreateAPIView):
    queryset = models.Message.objects.all()
    serializer_class = serializers.MessageSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if user:
            serializer.save(user=user)
        serializer.save()

class MessageRetrieveUpdateDeleteView(AuthenticationRequiredMixin, RetrieveUpdateDestroyAPIView):
    queryset = models.Message.objects.all()
    serializer_class = serializers.MessageSerializer

    def perform_update(self, serializer):
        user = self.request.user
        if user:
            serializer.save(user=user)
        serializer.save()