from rest_framework import serializers
from ..models import User, EmployerProfile, JobSeekerProfile

class UserListSerializer(serializers.ModelSerializer):
    name     = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    status   = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = ['id', 'email', 'role', 'name', 'location', 'status', 'created_at']

    def get_name(self, obj):
        if obj.role == 'employer':
            profile = getattr(obj, 'employer_profile', None)
            return profile.business_name if profile else obj.email
        elif obj.role == 'job_seeker':
            profile = getattr(obj, 'job_seeker_profile', None)
            return profile.full_name if profile else obj.email
        return obj.email  # admin or unknown

    def get_location(self, obj):
        if obj.role == 'employer':
            profile = getattr(obj, 'employer_profile', None)
            return profile.location if profile else ''
        elif obj.role == 'job_seeker':
            profile = getattr(obj, 'job_seeker_profile', None)
            return profile.current_location if profile else ''
        return ''

    def get_status(self, obj):
        return 'Blocked' if not obj.is_active else 'Active'