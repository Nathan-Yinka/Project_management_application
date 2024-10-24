from django.contrib.auth import get_user_model
from rest_framework import serializers
from guardian.shortcuts import get_perms
from .models import Organization, Membership,PendingMembership
from core.utils import get_user_all_permissions

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = '__all__'
        read_only_fields = ('date_joined',)

class OrganizationSerializer(serializers.ModelSerializer):
    user_memberships = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Organization
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at')
    
    def get_user_memberships(self, obj):
        """
        Get the list of memberships for this organization.
        """
        memberships = obj.user_memberships.all()  # Access the related memberships
        return MembershipSerializer(memberships, many=True).data


class PendingMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingMembership
        fields = "__all__"

    def validate(self, data):
        """
        Check if the user is already a member of the organization.
        """
        email = data.get('email')
        organization = data.get('organization')

        # Check if there's an existing membership for the given organization and email
        if Membership.objects.filter(user__email__iexact=email, organization=organization).exists():
            raise serializers.ValidationError("The user is already a member of this organization.")
        
        if PendingMembership.objects.filter(email__iexact=email, organization=organization).exists():
            raise serializers.ValidationError("The user has been invited to join the organization and will be added after he registers")

        return data

class RemoveMembershipSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    organization = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all())


class LeaveOrganizationSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)

    def validate_organization_id(self, value):
        """
        Validate that the organization exists.
        """
        if not Organization.objects.filter(id=value).exists():
            raise serializers.ValidationError("The specified organization does not exist.")
        return value

class OrganizationDetailSerializer(serializers.ModelSerializer):
    users = serializers.SerializerMethodField()
    user_permissions = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ('id', 'name', 'description', 'created_at', 'created_by', 'users', 'user_permissions')

    def get_users(self, obj):
        """
        Get all users who are members of the specified organization.
        """
        users = User.objects.filter(memberships__organization=obj)
        return UserSerializer(users, many=True).data

    def get_user_permissions(self, obj):
        """
        Get the permissions the current user has in the organization.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return get_user_all_permissions(request.user, organization=obj)
        return []