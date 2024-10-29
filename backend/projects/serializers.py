from rest_framework import serializers
from core.utils import get_user_permissions_for_instance 
from organizations.models import Membership
from .models import Project,Comment
from users.serializers import UserDetailSerializer


class ProjectSerializer(serializers.ModelSerializer):
    user_permissions = serializers.SerializerMethodField(read_only=True)
    user = UserDetailSerializer(read_only=True, source='assigned_to')
    class Meta:
        model = Project
        fields = '__all__'
        extra_fields = ['user_permissions','user']
        read_only_fields = ['created_by']

    def get_user_permissions(self, obj):
        """
        Get the list of permissions the current user has for this project.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return get_user_permissions_for_instance(request.user, obj)
        return []
    
    def validate(self, data):
        """
        Custom validation to ensure that the assigned user is part of the organization.
        """
        organization = data.get('organization')
        assigned_user = data.get('assigned_to')

        # Check if the organization is provided
        if not organization:
            raise serializers.ValidationError({"organization": "This field is required."})

        # If assigned_user is provided, ensure they are part of the organization
        if assigned_user:
            is_member = Membership.objects.filter(user=assigned_user, organization=organization).exists()
            if not is_member:
                raise serializers.ValidationError({"assigned_to": "The user must be a member of the organization to be assigned to this project."})

        return data

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