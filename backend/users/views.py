from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import UserRegisterSerializer,UserDetailSerializer
from rest_framework.authtoken.views import ObtainAuthToken

from core.mixin import RetrieveAuthenticatedUserMixin

User = get_user_model()

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserLoginView(ObtainAuthToken):
    permission_classes = [permissions.AllowAny]

class UserDetailView(RetrieveAuthenticatedUserMixin, generics.RetrieveAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

