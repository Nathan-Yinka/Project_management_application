from django.conf import settings
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Organization(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, related_name='created_organizations', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Membership(models.Model):
    
    ROLE_CHOICES = [(value, key) for key, value in settings.USER_ROLES.items()]

    user = models.ForeignKey(User, related_name='memberships', on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, related_name='memberships', on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'organization')

    def __str__(self):
        return f"{self.user.username} - {self.organization.name} ({self.role})"
    
class PendingMembership(models.Model):
    ROLE_CHOICES = [(value, key) for key, value in settings.USER_ROLES.items()]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='pending_memberships')
    email = models.EmailField()
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.email} - {self.role} at {self.organization.name}"
