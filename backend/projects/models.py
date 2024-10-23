from django.db import models
from django.conf import settings
from organizations.models import Organization

class Project(models.Model):
    # Convert the dictionary to a list of tuples
    STATUS_CHOICES = [(key, value) for key, value in settings.PROJECT_STATUS_CHOICES.items()]
    PRIORITY_CHOICES = [(key, value) for key, value in settings.PROJECT_PRIORITY_CHOICES.items()]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='low')
    organization = models.ForeignKey(Organization, related_name='projects', on_delete=models.CASCADE)  # Link to Organization
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='assigned_projects', on_delete=models.SET_NULL, blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='created_projects', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        permissions = [
            ("update_project_status", "Can update the status of the project"),
        ]

    def __str__(self):
        return self.name
    
class Comment(models.Model):
    project = models.ForeignKey('Project', related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comments', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        permissions = [
            ("can_comment", "Can add comments to the project"),
        ]

    def __str__(self):
        return f"Comment by {self.user} on {self.project}"