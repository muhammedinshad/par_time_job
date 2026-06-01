from rest_framework import serializers
from ..models import Application
from apps.jobs.models import Job


class ApplicationCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Application
        fields = [
            'job',
            'cover_note',
            'cv_snapshot',
            # Delivery
            'has_vehicle',
            'license_photo',
            # Teaching
            'qualification',
            # Teaching + Health Care
            'experience_details',
            # Health Care
            'health_certificate',
        ]
        extra_kwargs = {
            'has_vehicle'        : {'required': False},
            'license_photo'      : {'required': False},
            'qualification'      : {'required': False},
            'experience_details' : {'required': False},
            'health_certificate' : {'required': False},
            'cover_note'         : {'required': False},
            'cv_snapshot'        : {'required': False},
        }
        
    def validate_cv_snapshot(self,value):
        if value :
            return value
        raise serializers.ValidationError(" cv not apload")

    def validate(self, data):
        job      = data.get('job')
        category = job.category
        errors   = {}
        
        seeker = self.context['request'].user.job_seeker_profile
        
        if not data.get('cv_snapshot') and not seeker.cv:
            errors['cv_snapshot'] = 'Please upload a CV or add one in your profile.'

# ─── Delivery ─────────
        if category == 'delivery':
            if data.get('has_vehicle') is None:
                errors['has_vehicle'] = 'This field is required for delivery jobs.'
            if not data.get('license_photo'):
                errors['license_photo'] = 'License photo is required for delivery jobs.'

# ─── education ────────
        elif category == 'education':
            if not data.get('qualification'):
                errors['qualification'] = 'Qualification is required for teaching jobs.'

# ─── Health Care ───────────
        elif category == 'health_care':
            if not data.get('health_certificate'):
                errors['health_certificate'] = 'Health certificate is required for health care jobs.'

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def create(self, validated_data):
        seeker = self.context['request'].user.job_seeker_profile

        # Already applied check
        if Application.objects.filter(
            job=validated_data['job'], seeker=seeker
        ).exists():
            raise serializers.ValidationError(
                {'detail': 'You have already applied to this job.'}
            )

        # Job active 
        if not validated_data['job'].is_active:
            raise serializers.ValidationError(
                {'detail': 'This job is no longer active.'}
            )

        # Slots full 
        accepted_count = validated_data['job'].applications.filter(
            status='accepted'
        ).count()
        if validated_data['job'].slots and accepted_count >= validated_data['job'].slots:
            raise serializers.ValidationError(
                {'detail': 'All slots for this job have been filled.'}
            )

        # Profile CV auto snapshot
        cv_snapshot = validated_data.pop('cv_snapshot', None) or seeker.cv

        return Application.objects.create(
            seeker      = seeker,
            cv_snapshot = cv_snapshot,
            **validated_data
        )
        

# ─── See the Applications for Job Seeker ────────────────────────────────
class MyApplicationSerializer(serializers.ModelSerializer):
    job_title     = serializers.CharField(source='job.title', read_only=True)
    job_category  = serializers.CharField(source='job.category', read_only=True)
    employer_name = serializers.CharField(source='job.employer.business_name', read_only=True)

    class Meta:
        model  = Application
        fields = [
            'id',
            'job_title',
            'job_category',
            'employer_name',
            'status',
            'employer_note',
            'applied_at',
        ]