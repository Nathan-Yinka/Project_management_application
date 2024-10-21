from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Organization, Membership
from django.core.mail import send_mail
from django.conf import settings

@receiver(post_save, sender=Organization)
def create_admin_membership(sender, instance, created, **kwargs):
    if created:
        # Create a membership for the organization creator with the 'admin' role
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
def send_membership_notification(sender, instance, created, **kwargs):
    if created and instance.role == settings.USER_ROLES['MEMBER']:
        # Send an email notification only if the user is added as a member
        send_mail(
            'You have been added to an organization',
            f'Hello {instance.user.username},\n\nYou have been added as a {instance.role} to the organization: {instance.organization.name}.',
            settings.DEFAULT_FROM_EMAIL,
            [instance.user.email],
            fail_silently=False,
        )
