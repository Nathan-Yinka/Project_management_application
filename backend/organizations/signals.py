from django.db.models.signals import post_save,pre_save,post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType
from django.core.mail import send_mail
from django.conf import settings
from guardian.shortcuts import assign_perm, remove_perm
from projects.models import Project
from .models import Organization, Membership,PendingMembership

User = get_user_model()


@receiver(post_save, sender=Organization)
def create_admin_membership(sender, instance, created, **kwargs):
    if created:
        admin_group, _ = Group.objects.get_or_create(name=f"{instance.name}_Admin")
        member_group, _ = Group.objects.get_or_create(name=f"{instance.name}_Member")

        assign_perm('add_project', admin_group, instance)
        assign_perm('add_user', admin_group, instance)
        assign_perm('remove_user', admin_group, instance)
        assign_perm('view_organization', member_group, instance)
        
        Membership.objects.create(
            user=instance.created_by,
            organization=instance,
            role=settings.USER_ROLES['ADMIN']
        )
        # Send an email notification to the organization creator
        send_mail(
            'You have created a new organization',
            f'Hello {instance.created_by.username},\n\nYou have successfully created the organization: {instance.name}. You are now the admin of this organization.',
            settings.DEFAULT_FROM_EMAIL,
            [instance.created_by.email],
            fail_silently=False,
        )

@receiver(post_save, sender=Membership)
def handle_membership_creation(sender, instance, created, **kwargs):

    # Get the admin and member groups for the organization
    admin_group, _ = Group.objects.get_or_create(name=f"{instance.organization.name}_Admin")
    member_group, _ = Group.objects.get_or_create(name=f"{instance.organization.name}_Member")

    if created:
        # New membership created: Add the user to the appropriate group
        if instance.role == settings.USER_ROLES['ADMIN']:
            instance.user.groups.add(admin_group)
            instance.user.groups.add(member_group)
        elif instance.role == settings.USER_ROLES['MEMBER']:
            instance.user.groups.add(member_group)
        
            # Send an email notification if the user is added as a member
            send_mail(
                'You have been added to an organization',
                f'Hello {instance.user.username},\n\nYou have been added as a {instance.role} to the organization: {instance.organization.name}.',
                settings.DEFAULT_FROM_EMAIL,
                [instance.user.email],
                fail_silently=False,
            )
        # assign_perm('organizations.remove_user', instance.user ,instance.user)

@receiver(pre_save, sender=Membership)
def handle_membership_update(sender, instance, **kwargs):
    """
    Before saving an updated membership, check if the role has changed.
    If the role has changed, update the group memberships accordingly.
    """
    if instance.pk:
        # Get the existing membership from the database
        previous_instance = Membership.objects.get(pk=instance.pk)
        previous_role = previous_instance.role

        # Get the admin and member groups for the organization
        admin_group = Group.objects.get(name=f"{instance.organization.name}_Admin")
        member_group = Group.objects.get(name=f"{instance.organization.name}_Member")

        if previous_role != instance.role:
            # The role has changed; update the group membership accordingly
            if previous_role == settings.USER_ROLES['ADMIN']:
                instance.user.groups.remove(admin_group)

            # Add the user to the new group based on the updated role
            if instance.role == settings.USER_ROLES['ADMIN']:
                instance.user.groups.add(admin_group)
                instance.user.groups.add(member_group)
            elif instance.role == settings.USER_ROLES['MEMBER']:
                instance.user.groups.add(member_group)

@receiver(post_delete, sender=Membership)
def handle_membership_deletion(sender, instance, **kwargs):
    """
    When a membership is deleted, remove the user from the appropriate groups.
    """
    # Get the admin and member groups for the organization
    admin_group = Group.objects.get(name=f"{instance.organization.name}_Admin")
    member_group = Group.objects.get(name=f"{instance.organization.name}_Member")

    # Remove the user from both groups
    instance.user.groups.remove(admin_group, member_group)


@receiver(post_save, sender=PendingMembership)
def process_pending_membership(sender, instance, created, **kwargs):
    if created:
        # Check if the email is associated with an existing user
        try:
            user = User.objects.get(email__iexact=instance.email)
            # Create a Membership for the user
            Membership.objects.create(
                user=user,
                organization=instance.organization,
                role=instance.role
            )
            # Optionally, you can delete the pending membership after successful conversion
            instance.delete()
        except User.DoesNotExist:
            # Send an email notification if the user is added as a member
            send_mail(
                'You have been invited to be added to an organization',
                f'Hello dear,\n\nYou have been invited to be added as a {instance.role} to the organization: {instance.organization.name}. Register on the platform to join the organization',
                settings.DEFAULT_FROM_EMAIL,
                [instance.email],
                fail_silently=False,
            )
            

@receiver(post_save, sender=User)
def assign_pending_memberships_to_user(sender, instance, created, **kwargs):
    if created:
        # Check if there are any pending memberships for this user's email
        pending_memberships = PendingMembership.objects.filter(email__iexact=instance.email)

        # Create Membership records for each pending membership
        for pending_membership in pending_memberships:
            Membership.objects.create(
                user=instance,
                organization=pending_membership.organization,
                role=pending_membership.role
            )
            # Optionally, delete the pending membership after conversion
            pending_membership.delete()
