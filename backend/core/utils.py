from guardian.shortcuts import get_perms
from django.contrib.auth.models import Group


def get_user_all_permissions(user, organization, objs=None):
    """
    Get all permissions the user has under a specific organization.
    If multiple object instances are provided, also include object-level permissions
    for each object, ensuring they belong to the specified organization.

    Args:
        user (User): The user for whom to get the permissions.
        organization (Organization): The organization instance under which to check permissions.
        objs (optional): A list of object instances to check object-level permissions for.

    Returns:
        set: A set of permission strings, e.g., 'projects.add_project'.
    """
    # Ensure the organization is provided
    if organization is None:
        raise ValueError("An organization must be specified to get permissions.")

    # Construct group names based on the organization name
    admin_group_name = f"{organization.name}_Admin"
    member_group_name = f"{organization.name}_Member"

    # Retrieve the groups
    admin_group = Group.objects.filter(name=admin_group_name).first()
    member_group = Group.objects.filter(name=member_group_name).first()

    # Get all user-level permissions (directly assigned)
    user_permissions = user.get_user_permissions()

    # Combine the user permissions with group-level permissions for the specific groups
    all_permissions = set(user_permissions)

    # Include permissions if the user belongs to the admin group
    if admin_group and admin_group in user.groups.all():
        admin_group_permissions = admin_group.permissions.all()
        all_permissions.update({f"{perm.content_type.app_label}.{perm.codename}" for perm in admin_group_permissions})

    # Include permissions if the user belongs to the member group
    if member_group and member_group in user.groups.all():
        member_group_permissions = member_group.permissions.all()
        all_permissions.update({f"{perm.content_type.app_label}.{perm.codename}" for perm in member_group_permissions})

    # If additional objects are provided, check that each belongs to the organization
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
