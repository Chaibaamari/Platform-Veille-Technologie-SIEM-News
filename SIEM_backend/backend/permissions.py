from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Permission pour vérifier si l'utilisateur est admin
    """

    print("hello")
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role_utilisateur == 'admin'
    
class IsUtilisateur(BasePermission):
    """
    Permission pour vérifier si l'utilisateur est admin
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role_utilisateur == 'utilisateur'
    
class IsVeilleur(BasePermission):
    """
    Permission pour vérifier si l'utilisateur est admin
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role_utilisateur == 'veilleur'
    
class IsAnalyste(BasePermission):
    """
    Permission pour vérifier si l'utilisateur est admin
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role_utilisateur == 'analyste'
