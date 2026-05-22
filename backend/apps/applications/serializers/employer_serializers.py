from rest_framework import serializers
from ..models import Application



# ─── Employer see the Application List ─────────────
class ApplicationDetailSerializer(serializers.ModelSerializer):
    seeker_name        = serializers.CharField(source='seeker.full_name', read_only=True)
    seeker_phone       = serializers.CharField(source='seeker.phone_number', read_only=True)
    seeker_location    = serializers.CharField(source='seeker.current_location', read_only=True)
    job_title          = serializers.CharField(source='job.title', read_only=True)
    job_category       = serializers.CharField(source='job.category', read_only=True)
    cv_url             = serializers.SerializerMethodField()
    license_photo_url  = serializers.SerializerMethodField()
    health_cert_url    = serializers.SerializerMethodField()

    class Meta:
        model  = Application
        fields = [
            'id',
            'job_title',
            'job_category',
            'seeker_name',
            'seeker_phone',
            'seeker_location',
            'status',
            'cover_note',
            # Delivery
            'has_vehicle',
            'license_photo_url',
            # Teaching
            'qualification',
            # Teaching + Health Care
            'experience_details',
            # Health Care
            'health_cert_url',
            # CV
            'cv_url',
            'employer_note',
            'applied_at',
        ]

    def get_cv_url(self, obj):
        if obj.cv_snapshot:
            return obj.cv_snapshot.url
        return None

    def get_license_photo_url(self, obj):
        if obj.license_photo:
            return obj.license_photo.url
        return None

    def get_health_cert_url(self, obj):
        if obj.health_certificate:
            return obj.health_certificate.url
        return None
    
    
# ─── Employer Accept / Reject ─────────────────────
class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Application
        fields = ['status', 'employer_note']

    def validate_status(self, value):
        if value not in ['accepted', 'rejected']:
            raise serializers.ValidationError(
                'Status must be accepted or rejected.'
            )
        return value
