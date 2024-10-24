from django.urls import path
from .views import OrganizationListCreateView,AddMemberView,RemoveMemberView,LeaveOrganizationView,ListOrganizationUsersView,OrganizationDetailView

urlpatterns=[
    path("",OrganizationListCreateView.as_view(),name="list_create_organization"),
    path("add_member",AddMemberView.as_view(),name="add_member"),
    path("remove-member",RemoveMemberView.as_view(),name="remove_member"),
    path("leave-organization",LeaveOrganizationView.as_view(),name="leave_organization"),
    path('<int:organization_id>/users/', ListOrganizationUsersView.as_view(), name='list_organization_users'),
    path('<int:organization_id>/', OrganizationDetailView.as_view(), name='organization_detail'),

]