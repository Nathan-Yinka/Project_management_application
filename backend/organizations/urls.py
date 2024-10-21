from django.urls import path
from .views import OrganizationListCreateView,AddMemberView,RemoveMemberView

urlpatterns=[
    path("",OrganizationListCreateView.as_view(),name="list_create_organization"),
    path("add_member",AddMemberView.as_view(),name="add_member"),
    path("remove-member",RemoveMemberView.as_view(),name="remove_member"),
]