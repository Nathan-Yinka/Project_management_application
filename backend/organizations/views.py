from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions,serializers,status
from rest_framework.response import Response
from core.permissions import IsOrganizationAdmin,IsOrganizationAdminOrSelf,CanAddProjectPermission,CanRemoveUserPermission,CanAddUserPermission,CanViewOrganizationPermission
from .models import Organization, Membership
from users.serializers import UserDetailSerializer
from .serializers import  MembershipSerializer,PendingMembershipSerializer,RemoveMembershipSerializer,LeaveOrganizationSerializer,OrganizationDetailSerializer,AddMembersSerializer
from guardian.utils import get_anonymous_user


User = get_user_model()

class OrganizationListCreateView(generics.ListCreateAPIView):
    """
    View to list all organizations where the current user is a member or an admin,
    and create a new organization. The membership is automatically created for the
    organization creator as an admin via signals.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrganizationDetailSerializer

    def get_queryset(self):
        # Return organizations where the current user is a member
        return Organization.objects.filter(user_memberships__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    

class AddMemberView(generics.CreateAPIView):
    """
    View to add new members to an organization as pending memberships.
    """
    serializer_class = AddMembersSerializer
    permission_classes = [permissions.IsAuthenticated, CanAddUserPermission]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Pending memberships created successfully."}, status=status.HTTP_201_CREATED)


class RemoveMemberView(generics.CreateAPIView):
    """
    View to remove a member from an organization using a POST request.
    Only admins of the organization can remove members or user can also remove themeselves.
    """
    serializer_class = RemoveMembershipSerializer
    permission_classes = [permissions.IsAuthenticated,CanRemoveUserPermission]

    def perform_create(self, serializer):
        organization = serializer.validated_data['organization']
        user = serializer.validated_data['user']
        membership = get_object_or_404(Membership, organization=organization, user=user)

        membership.delete()
        return Response({"detail": "Member removed successfully."}, status=200)
    

class LeaveOrganizationView(generics.CreateAPIView):
    """
    View that allows a user to leave an organization by deleting their own membership.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LeaveOrganizationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        organization_id = serializer.validated_data['organization_id']

        membership = get_object_or_404(Membership, user=request.user, organization_id=organization_id)

        membership.delete()
        return Response({"detail": "You have successfully left the organization."}, status=200)
    

class ListOrganizationUsersView(generics.ListAPIView):
    """
    View to list all users in an organization.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserDetailSerializer

    def get_queryset(self):
        # Get the organization ID from the request parameters
        organization_id = self.kwargs.get('organization_id')

        organization = get_object_or_404(Organization, id=organization_id)

        return User.objects.filter(memberships__organization=organization)


class ListUsersNotInOrganizationView(generics.ListAPIView):
    """
    View to list all users not in a specific organization, excluding anonymous users.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserDetailSerializer

    def get_queryset(self):
        # Get the organization ID from the request parameters
        organization_id = self.kwargs.get('organization_id')
        organization = get_object_or_404(Organization, id=organization_id)

        # Get the anonymous user instance
        anonymous_user = get_anonymous_user()

        # Exclude users who are part of the organization and the anonymous user
        return User.objects.exclude(
            memberships__organization=organization
        ).exclude(id=anonymous_user.id)


class OrganizationDetailView(generics.RetrieveAPIView):
    """
    View to get organization details, the list of users, and the permissions
    the current user has in the organization.
    """
    permission_classes = [permissions.IsAuthenticated,CanViewOrganizationPermission]
    serializer_class = OrganizationDetailSerializer

    def get_object(self):
        organization_id = self.kwargs.get('organization_id')
        return get_object_or_404(Organization, id=organization_id)