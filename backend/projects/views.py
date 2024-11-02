# views.py
from rest_framework import generics, permissions,serializers
from django.db.models import Q
from guardian.shortcuts import get_objects_for_user
from .models import Project,Comment
from .serializers import ProjectSerializer,ProjectStatusSerializer,CommentSerializer
from core.permissions import CanAddProjectPermission,CanUpdateProjectStatusPermission,CanCommentOnProjectPermission,CanUpdateProjectPermission
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
        search_query = self.request.query_params.get('search', '')

        # Base queryset with permissions and organization filter
        queryset = get_objects_for_user(user, 'view_project', klass=Project).filter(organization_id=organization_id)

        # Apply search filter if a search query is provided
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(assigned_to__username__icontains=search_query) | 
                Q(assigned_to__email__icontains=search_query) |
                Q(assigned_to__first_name__icontains=search_query) | 
                Q(assigned_to__first_name__icontains=search_query) 
            )

        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a project.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated,CanUpdateProjectPermission]

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
        return get_object_or_404(Project, id=project_id)
    

class AddCommentView(generics.CreateAPIView):
    """
    View to add a comment to a project.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, CanCommentOnProjectPermission]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)