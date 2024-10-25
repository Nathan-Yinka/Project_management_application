# views.py
from rest_framework import generics, permissions,serializers
from guardian.shortcuts import get_objects_for_user
from .models import Project,Comment
from .serializers import ProjectSerializer,ProjectStatusSerializer,CommentSerializer
from core.permissions import CanAddProjectPermission,CanUpdateProjectStatusPermission,CanCommentOnProjectPermission
from django.shortcuts import get_object_or_404

class ProjectListCreateView(generics.ListCreateAPIView):
    """
    View to list all projects or create a new project.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated,CanAddProjectPermission]

    def get_queryset(self):
        user = self.request.user
        organization_id = self.request.query_params.get('organization_id')
        return get_objects_for_user(user, 'view_project',klass=Project)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a project.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated,permissions.DjangoObjectPermissions]

class UpdateProjectStatus(generics.UpdateAPIView):
    """
    View to update the status of a project.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectStatusSerializer
    permission_classes = [permissions.IsAuthenticated, CanUpdateProjectStatusPermission]

    def get_object(self):
        """
        Override to get the project instance based on the request data.
        """
        project_id = self.kwargs.get('project_id')
        organization_id = self.request.data.get("organization")
        if not organization_id:
            raise serializers.ValidationError({"organization": "This field is required."})
        return get_object_or_404(Project, id=project_id, organization_id=organization_id)
    

class AddCommentView(generics.CreateAPIView):
    """
    View to add a comment to a project.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, CanCommentOnProjectPermission]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)