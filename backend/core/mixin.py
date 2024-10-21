from rest_framework.exceptions import NotAuthenticated

class RetrieveAuthenticatedUserMixin:
    """
    Mixin to retrieve the authenticated user as the object.
    """
    def get_object(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            raise NotAuthenticated("Authentication credentials were not provided.")
        return user