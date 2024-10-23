from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from organizations.models import Organization,Membership
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class IsOrganizationAdmin(BasePermission):
    """
    Custom permission to check if the user is an admin of the organization
    they are trying to add a member to. This version is more robust and handles
    various edge cases gracefully.
    """

    def has_permission(self, request, view):
        # Ensure the user is authenticated
        if not request.user or not request.user.is_authenticated:
            logger.warning("Unauthorized access attempt by anonymous user.")
            return False

        # Get the organization ID from the request data
        organization_id = request.data.get('organization')
        
        # If the organization ID is not provided, deny permission
        if not organization_id:
            logger.warning(f"Organization ID not provided by user {request.user}.")
            raise PermissionDenied("Organization ID is required.")

        # Validate if the organization exists
        try:
            organization = Organization.objects.get(id=organization_id)
        except Organization.DoesNotExist:
            logger.warning(f"Organization with ID {organization_id} does not exist.")
            raise PermissionDenied("The specified organization does not exist.")

        # Check if the current user is an admin of the organization
        admin_role = settings.USER_ROLES['ADMIN']
        is_admin = Membership.objects.filter(
            user=request.user, 
            organization=organization, 
            role=admin_role
        ).exists()

        if not is_admin:
            logger.warning(f"User {request.user} is not an admin of organization {organization.name}.")
            raise PermissionDenied("You are not authorized to add members to this organization.")

        # Log successful admin check
        logger.info(f"User {request.user} is authorized as admin for organization {organization.name}.")
        return True



class IsOrganizationAdminOrSelf(IsOrganizationAdmin):
    """
    Extends the IsOrganizationAdmin permission to also allow users to remove themselves
    from an organization.
    """

    def has_permission(self, request, view):
        is_admin = super().has_permission(request, view)

        if is_admin:
            return True

        user_to_remove_id = request.data.get('user')
        if not user_to_remove_id:
            raise PermissionDenied("User ID is required to perform this action.")

        is_self_removal = request.user.id == user_to_remove_id

        if is_self_removal:
            return True
            
        raise PermissionDenied("You are not authorized to perform this action.")