from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from . import views

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    path('', views.HomeView.as_view()),
    path('users/', views.UserListCreateView.as_view(), name='users'),
    path('get-user/', views.UserGetView.as_view()),

    path('rooms/', views.RoomListCreateView.as_view(), name='rooms'),
    path('rooms/<int:pk>/', views.RoomRetrieveUpdateDeleteView.as_view(), name='room'),
    path('messages/', views.MessageListCreateView.as_view(), name='messages'),
    path('messages/<int:pk>/', views.MessageRetrieveUpdateDeleteView.as_view(), name='message'),

]
