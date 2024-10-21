from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions,serializers
from rest_framework.response import Response
from .models import Organization, Membership
from .serializers import OrganizationSerializer, MembershipSerializer


class OrganizationListCreateView(generics.ListCreateAPIView):
    """
    View to list all organizations where the current user is a member or an admin,
    and create a new organization. The membership is automatically created for the
    organization creator as an admin via signals.
    """
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return organizations where the current user is a member
        return Organization.objects.filter(memberships__user=self.request.user)

    def perform_create(self, serializer):
        # Save the new organization with the current user as the creator
        serializer.save(created_by=self.request.user)
    
class AddMemberView(generics.CreateAPIView):
    """
    View to add a new member to an organization. The membership signal
    will send an email notification to the new member.
    """
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Get the organization from the validated data
        organization = serializer.validated_data['organization']

        # Check if the current user is an admin of the organization
        admin_role = settings.USER_ROLES['ADMIN']
        if not Membership.objects.filter(user=self.request.user, organization=organization, role=admin_role).exists():
            raise serializers.ValidationError("You are not authorized to add members to this organization.")

        serializer.save()

class RemoveMemberView(generics.GenericAPIView):
    """
    View to remove a member from an organization.
    Only admins of the organization can remove members.
    """
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        # Use the serializer to validate the input data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get the organization from the validated data
        organization = serializer.validated_data['organization']
        
        # Get the organization from the validated data
        user = serializer.validated_data['user']

        membership = get_object_or_404(Membership, organization=organization, user=user)

        admin_role = settings.USER_ROLES['ADMIN']
        if not Membership.objects.filter(user=request.user, organization=organization, role=admin_role).exists():
            raise serializers.ValidationError("You are not authorized to remove members from this organization.")
        
        membership.delete()
        return Response({"detail": "Member removed successfully."}, status=204)
