from django.contrib import admin
from django.urls import path,include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Project Management API",
        default_version='v1',
        description="API documentation for the Project Management app",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="oludarenathaniel@gmail.com"),
        license=openapi.License(name="Nathan-Yinka License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/",include("users.urls")),
    path("organization/",include("organizations.urls")),
    path("project/",include("projects.urls")),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
