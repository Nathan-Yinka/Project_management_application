from guardian.shortcuts import get_perms
from django.contrib.auth.models import Group

from guardian.shortcuts import get_perms

def get_user_all_permissions(user, organization, objs=None):
    """
    Get all permissions for a user in a specific organization, including
    object-level permissions assigned to the user's groups and any specified objects.
    """
    all_permissions = set()

    # Get the admin and member groups for the organization
    admin_group, _ = Group.objects.get_or_create(name=f"{organization.name}_Admin")
    member_group, _ = Group.objects.get_or_create(name=f"{organization.name}_Member")

    # Include object-level permissions if the user belongs to the admin group
    if admin_group and admin_group in user.groups.all():
        admin_group_permissions = get_perms(user, organization)
        print("the prems fron object level is",admin_group_permissions)
        all_permissions.update({f"{organization._meta.app_label}.{perm}" for perm in admin_group_permissions})

    # Include object-level permissions if the user belongs to the member group
    if member_group and member_group in user.groups.all():
        member_group_permissions = get_perms(user, organization)
        print("the prems fron object level is member_group_permissions",member_group_permissions)
        all_permissions.update({f"{organization._meta.app_label}.{perm}" for perm in member_group_permissions})

    # Handle additional objects to check for object-level permissions
    if objs:
        for obj in objs:
            # Ensure the object is associated with the specified organization
            if not hasattr(obj, 'organization') or obj.organization != organization:
                raise ValueError(f"The object {obj} does not belong to the specified organization.")

            # Get object-level permissions for the object
            object_permissions = get_perms(user, obj)
            # Format permissions as 'app_label.permission_codename'
            obj_app_label = obj._meta.app_label
            object_permissions = {f"{obj_app_label}.{perm}" for perm in object_permissions}
            # Add object-level permissions to the overall set
            all_permissions.update(object_permissions)

    # Print all collected permissions (for debugging purposes)
    print(all_permissions)
    return all_permissions


def get_user_permissions_for_instance(user, objs):
    """
    Get all object-level permissions the user has for a specific object or multiple objects.

    Args:
        user (User): The user for whom to get the permissions.
        objs (list or object): A single object instance or a list of object instances to check permissions for.

    Returns:
        set: A set of permission strings, e.g., 'projects.view_project'.
    """
    # Make sure objs is a list
    if not isinstance(objs, list):
        objs = [objs]

    # Initialize a set to hold the permissions for the user
    all_permissions = set()

    # Get object-level permissions for each provided instance
    for obj in objs:
        object_permissions = get_perms(user, obj)
        # Format object-level permissions as 'app_label.permission_codename'
        app_label = obj._meta.app_label
        formatted_permissions = {f"{app_label}.{perm}" for perm in object_permissions}
        # Add object-level permissions to the overall set
        all_permissions.update(formatted_permissions)

    return all_permissions
