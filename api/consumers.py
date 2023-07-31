import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from . import serializers, models
from django.contrib.auth import get_user_model

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = str(self.scope['url_route']['kwargs']['id'])
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        self.send(text_data=json.dumps({
            'type': 'connected',
            'message': 'message'
        }))
    
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        message = text_data_json['message']
        username = text_data_json['username']
        data = {
          "message": message,
          "username": username,
        }

        user = get_user_model().objects.get(username=username)
        room_id = self.scope['url_route']['kwargs']['id']
        room = models.Room.objects.get(id=room_id)
        models.Message.objects.create(user=user, content=message, room=room)

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': json.dumps(data)
            }
        )

    def chat_message(self, event):
        message = event['message']

        self.send(text_data=json.dumps({
            'type': 'chat',
            'message': message
        }))