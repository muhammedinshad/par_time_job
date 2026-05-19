from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Allow access only to users with role = 'admin'."""
    message = 'Only admins can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'admin'
        )


class IsEmployer(BasePermission):
    """Allow access only to users with role = 'employer'."""
    message = 'Only employers can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'employer'
        )


class IsJobSeeker(BasePermission):
    """Allow access only to users with role = 'job_seeker'."""
    message = 'Only job seekers can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'job_seeker'
        )


class IsAdminOrEmployer(BasePermission):
    """Allow access to admins or employers."""
    message = 'Only admins or employers can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ('admin', 'employer')
        )


class IsAdminOrJobSeeker(BasePermission):
    """Allow access to admins or job seekers."""
    message = 'Only admins or job seekers can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ('admin', 'job_seeker')
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Object-level permission.
    Allow access if the user owns the object OR is an admin.

    Your model must have one of these fields:
      - obj.user
      - obj.employer  (for Job / EmployerProfile)
      - obj.job_seeker
    """
    message = 'You do not have permission to access this object.'

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.role == 'admin':
            return True

        # works for User, EmployerProfile, JobSeekerProfile models
        if hasattr(obj, 'user'):
            return obj.user == request.user

        # works for Job model  (obj.employer is an EmployerProfile)
        if hasattr(obj, 'employer'):
            return (
                hasattr(request.user, 'employer_profile') and
                obj.employer == request.user.employer_profile
            )

        if hasattr(obj, 'job_seeker'):
            return (
                hasattr(request.user, 'job_seeker_profile') and
                obj.job_seeker == request.user.job_seeker_profile
            )

        return False
    