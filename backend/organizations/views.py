from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions,serializers
from rest_framework.response import Response
from core.permissions import IsOrganizationAdmin,IsOrganizationAdminOrSelf
from .models import Organization, Membership
from .serializers import OrganizationSerializer, MembershipSerializer,PendingMembershipSerializer


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
    
# class AddMemberView(generics.CreateAPIView):
#     """
#     View to add a new member to an organization. The membership signal
#     will send an email notification to the new member.
#     """
#     serializer_class = MembershipSerializer
#     permission_classes = [permissions.IsAuthenticated,IsOrganizationAdmin]

class AddMemberView(generics.CreateAPIView):
    """
    View to add a new member to an organization. This creates a pending membership
    instead of directly adding the member. An email notification can be sent later
    to complete the membership process.
    """
    serializer_class = PendingMembershipSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizationAdmin]



class RemoveMemberView(generics.CreateAPIView):
    """
    View to remove a member from an organization using a POST request.
    Only admins of the organization can remove members or user can also remove themeselves.
    """
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated,IsOrganizationAdminOrSelf]

    def perform_create(self, serializer):
        organization = serializer.validated_data['organization']
        user = serializer.validated_data['user']

        membership = get_object_or_404(Membership, organization=organization, user=user)

        membership.delete()
        return Response({"detail": "Member removed successfully."}, status=204)