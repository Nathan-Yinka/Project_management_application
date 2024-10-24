from rest_framework import serializers
from core.utils import get_user_permissions_for_instance 
from .models import Project,Comment

class ProjectSerializer(serializers.ModelSerializer):
    user_permissions = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Project
        fields = '__all__'
        extra_fields = ['user_permissions']
        read_only_fields = ['created_by']

    def get_user_permissions(self, obj):
        """
        Get the list of permissions the current user has for this project.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return get_user_permissions_for_instance(request.user, obj)
        return []

class ProjectStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "status", "organization"]

    def validate(self, data):
        """
        Custom validation to ensure that the organization exists and belongs to the project.
        """
        project = self.instance
        if data['organization'] != project.organization:
            raise serializers.ValidationError({"organization": "The organization does not match the project's organization."})
        return data

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'project', 'user', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)