from django.urls import path
from .views import UserRegisterView,UserLoginView,UserDetailView

urlpatterns = [
    path("login",UserLoginView.as_view(),name="obtain_token"),
    path("register",UserRegisterView.as_view(),name="register"),
    path('me/', UserDetailView.as_view(), name='user-details'),
]