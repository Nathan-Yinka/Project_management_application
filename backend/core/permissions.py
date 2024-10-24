from rest_framework.permissions import BasePermission,SAFE_METHODS
from rest_framework.exceptions import PermissionDenied
from organizations.models import Organization,Membership
from projects.models import Project
from django.shortcuts import get_object_or_404
from django.conf import settings
from guardian.shortcuts import get_perms
from .utils import get_user_all_permissions

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
    


class CanAddProjectPermission(BasePermission):
    """
    Custom permission to check if the user has the 'add_project' permission for the organization.
    The user must be a member of the organization and have the 'add_project' permission.
    """

    def has_permission(self, request, view):
        # Allow safe methods (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            logger.info(f"Safe method request from user {request.user} is allowed.")
            return True

        # Check if the user has permission to add a project
        return self.check_permission(request, 'organizations.add_project')

    def check_permission(self, request, permission_codename, view=None):
        organization = self.get_organization(request.data.get('organization') or (view.kwargs.get('organization_id') if view is not None else "") ) 
        
        if not self.is_user_member_of_organization(request.user, organization):
            logger.warning(f"User {request.user} is not a member of organization {organization.name}.")
            raise PermissionDenied("You must be a member of the organization.")

        user_permissions = get_user_all_permissions(request.user, organization)
        if permission_codename in user_permissions:
            logger.info(f"User {request.user} has '{permission_codename}' permission in organization {organization.name}.")
            return True

        logger.warning(f"User {request.user} does not have '{permission_codename}' permission.")
        raise PermissionDenied(f"You do not have permission to perform this action in the organization.")

    def get_organization(self, organization_id):
        from organizations.models import Organization
        if not organization_id:
            raise PermissionDenied("Organization ID is required.")
        try:
            return Organization.objects.get(id=organization_id)
        except Organization.DoesNotExist:
            raise PermissionDenied("Organization does not exist.")

    def is_user_member_of_organization(self, user, organization):
        from organizations.models import Membership
        return Membership.objects.filter(user=user, organization=organization).exists()


class CanAddUserPermission(CanAddProjectPermission):
    """
    Custom permission to check if the user has the 'add_user' permission for the organization.
    The user must be a member of the organization and have the 'add_user' permission.
    """

    def has_permission(self, request, view):
        # Allow safe methods (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            logger.info(f"Safe method request from user {request.user} is allowed.")
            return True

        # Check if the user has permission to add a user
        return self.check_permission(request, 'organizations.add_user')
    
class CanViewOrganizationPermission(CanAddProjectPermission):
    """
    Custom permission to check if the user has the 'view_organization' permission for the organization.
    The user must be a member of the organization and have the 'view_organization' permission.
    """

    def has_permission(self, request, view):
        return self.check_permission(request, 'organizations.view_organization',view=view)

class CanRemoveUserPermission(CanAddProjectPermission):
    """
    Custom permission to check if the user has the 'remove_user' permission for the organization.
    The user must be a member of the organization and have the 'remove_user' permission.
    """

    def has_permission(self, request, view):
        # Allow safe methods (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            logger.info(f"Safe method request from user {request.user} is allowed.")
            return True

        # Check if the user has permission to remove a user
        return self.check_permission(request, 'organizations.remove_user')


class CanUpdateProjectStatusPermission(BasePermission):
    """
    Custom permission to check if the user has the 'update_project_status' permission.
    """
    
    def has_permission(self, request, view):

        # Get the project_id from the request data
        project_id = view.kwargs.get("project_id")
        if not project_id:
            logger.warning(f"Project ID not provided in the request by user {request.user}.")
            raise PermissionDenied("Project ID is required to add a comment.")

        # Fetch the project instance
        try:
            project = get_object_or_404(Project, id=project_id)
        except Project.DoesNotExist:
            logger.error(f"Project with ID {project_id} does not exist. Request by user {request.user}.")
            raise PermissionDenied("The specified project does not exist.")
        user_permissions = get_perms(request.user, project)
        print(user_permissions)
        has_permission = 'update_project_status' in user_permissions

        if not has_permission:
            logger.warning(f"User {request.user} does not have 'update_project_status' permission for project {project}.")
        
            return has_permission
        return False



class CanCommentOnProjectPermission(BasePermission):
    """
    Custom permission to check if the user has the 'can_comment' permission
    for a specific project.
    """

    def has_permission(self, request, view):

        # Get the project_id from the request data
        project_id = request.data.get('project')
        if not project_id:
            logger.warning(f"Project ID not provided in the request by user {request.user}.")
            raise PermissionDenied("Project ID is required to add a comment.")

        # Fetch the project instance
        try:
            project = get_object_or_404(Project, id=project_id)
        except Project.DoesNotExist:
            logger.error(f"Project with ID {project_id} does not exist. Request by user {request.user}.")
            raise PermissionDenied("The specified project does not exist.")

        # Check if the user has the 'can_comment' permission for the project
        if 'can_comment' in get_perms(request.user, project):
            logger.info(f"User {request.user} has 'can_comment' permission for project {project_id}.")
            return True

        # Log the permission failure for debugging
        logger.warning(f"User {request.user} does not have 'can_comment' permission for project {project_id}.")
        raise PermissionDenied("You do not have permission to comment on this project.")