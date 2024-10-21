from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), 
                lookup='iexact', 
                message="A user with this email already exists."
            )
        ]
    )
    username = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                lookup='iexact',
                message="A user with this username already exists."
            )
        ]
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password','first_name', 'last_name')

    def validate(self, attrs):
        attrs['email'] = attrs['email'].strip().lower()
        attrs['username'] = attrs['username'].strip().lower()
        attrs['first_name'] = attrs['first_name'].strip().lower()
        attrs['last_name'] = attrs['last_name'].strip().lower()

        return attrs


    def create(self, validated_data):
        # Create a new user with the validated data
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user
    
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')