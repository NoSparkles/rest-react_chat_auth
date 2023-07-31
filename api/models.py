from django.db import models
from django.contrib.auth import get_user_model


class Room(models.Model):
    host = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, related_name='host')
    users = models.ManyToManyField(get_user_model(), blank=True)

    @property
    def get_messages(self):
        return self.message_set.all()


class Message(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True)
    content = models.CharField(max_length=200, blank=False)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, null=False)


