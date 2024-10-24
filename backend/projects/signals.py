from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import Group
from guardian.shortcuts import assign_perm, remove_perm
from .models import Project


@receiver(post_save, sender=Project)
def assign_project_group_permissions(sender, instance, created, **kwargs):
    """
    Assign permissions to the 'Admin' and 'Member' groups, and to the assigned user.
    """
    # Get the groups for the organization
    admin_group = Group.objects.get(name=f"{instance.organization.name}_Admin")
    member_group = Group.objects.get(name=f"{instance.organization.name}_Member")

    if created:
        # Assign permissions to admin group for the project instance
        assign_perm('projects.view_project', admin_group, instance)
        assign_perm('projects.change_project', admin_group, instance)
        assign_perm('projects.delete_project', admin_group, instance)
        assign_perm('projects.update_project_status', admin_group, instance)
        assign_perm('can_comment', admin_group, instance)

        # Assign 'change_project' and 'update_project_status' permissions to the assigned user
        if instance.assigned_to:
            assign_perm('projects.view_project', instance.assigned_to, instance)
            assign_perm('projects.update_project_status', instance.assigned_to, instance)
            assign_perm('can_comment', instance.assigned_to, instance)

@receiver(pre_save, sender=Project)
def update_project_assigned_permissions(sender, instance, **kwargs):
    """
    Update permissions when the assigned user changes.
    """
    # Check if this is an update (not a new instance)
    if instance.pk:
        # Get the existing project from the database
        previous_instance = Project.objects.get(pk=instance.pk)
        previous_assigned_user = previous_instance.assigned_to

        # If the assigned user has changed, update the permissions accordingly
        if previous_assigned_user != instance.assigned_to:
            # Remove permissions from the previous assigned user
            if previous_assigned_user:
                remove_perm('projects.view_project', previous_assigned_user, instance)
                remove_perm('projects.update_project_status', previous_assigned_user, instance)
                remove_perm('can_comment', previous_assigned_user, instance)

            # Assign permissions to the new assigned user
            if instance.assigned_to:
                assign_perm('projects.view_project', instance.assigned_to, instance)
                assign_perm('projects.update_project_status', instance.assigned_to, instance)
                assign_perm('can_comment', instance.assigned_to, instance)

@receiver(post_delete, sender=Project)
def remove_project_permissions(sender, instance, **kwargs):
    """
    Remove all permissions for the project when it is deleted.
    """
    # Get the groups for the organization
    admin_group = Group.objects.get(name=f"{instance.organization.name}_Admin")

    # Remove permissions for the admin and member groups for the project instance
    remove_perm('projects.view_project', admin_group, instance)
    remove_perm('projects.change_project', admin_group, instance)
    remove_perm('projects.delete_project', admin_group, instance)
    remove_perm('projects.update_project_status', admin_group, instance)
    remove_perm('can_comment', admin_group, instance)

    # Remove permissions from the assigned user
    if instance.assigned_to:
        remove_perm('projects.view_project', instance.assigned_to, instance)
        remove_perm('projects.update_project_status', instance.assigned_to, instance)
        remove_perm('can_comment', instance.assigned_to, instance)
