from django.contrib.auth import get_user_model
from rest_framework import serializers
from guardian.shortcuts import get_perms
from .models import Organization, Membership,PendingMembership
from core.utils import get_user_all_permissions
from django.db.models.signals import post_save

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name','name')

    def get_name(self, obj):
        # Combine first_name and last_name to form the full name
        return f"{obj.first_name} {obj.last_name}".strip()


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
    
class AddMembersSerializer(serializers.Serializer):
    emails = serializers.ListField(
        child=serializers.EmailField(),
        allow_empty=False,
        help_text="List of emails to invite as members"
    )
    organization = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all())

    def validate(self, data):
        """
        Check if each user in the list is already a member or has a pending invitation.
        """
        emails = data.get('emails')
        organization = data.get('organization')
        

        # Validate each email
        for email in emails:
            if Membership.objects.filter(user__email__iexact=email, organization=organization).exists():
                raise serializers.ValidationError(
                    {"emails": f"The user with email {email} is already a member of this organization."}
                )
            if PendingMembership.objects.filter(email__iexact=email, organization=organization).exists():
                raise serializers.ValidationError(
                    {"emails": f"The user with email {email} has already been invited to join the organization."}
                )

        return data

    def create(self, validated_data):
        """
        Create pending memberships for each email.
        """
        emails = validated_data.get('emails')
        organization = validated_data.get('organization')
        created_memberships = []

        for email in emails:
            # Save each membership individually to ensure primary key assignment and signal triggering
            membership = PendingMembership.objects.create(email=email, organization=organization, role="member")
            created_memberships.append(membership)

        return created_memberships

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
    users = serializers.SerializerMethodField(read_only=True)
    user_permissions = serializers.SerializerMethodField(read_only=True)
    user_memberships = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Organization
        fields = ('id', 'name', 'description', 'created_at', 'created_by', 'users', 'user_permissions','user_memberships')
        read_only_fields = ('created_by', 'created_at')

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
    
    def get_user_memberships(self, obj):
        """
        Get the list of memberships for this organization.
        """
        memberships = obj.user_memberships.all()  # Access the related memberships
        return MembershipSerializer(memberships, many=True).data