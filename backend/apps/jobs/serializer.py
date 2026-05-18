from rest_framework import serializers
from .models import Job



class JobSerializer(serializers.ModelSerializer):
    employer_name     = serializers.CharField(source='employer.business_name', read_only=True)
    employer_location = serializers.CharField(source='employer.location',      read_only=True)
    employer_phone  = serializers.CharField(source ='employer.phone_number', read_only = True )

    class Meta:
        model  = Job
        fields = [
            'id',
            'employer', 'employer_name', 'employer_location', 'employer_phone',
            'title', 'description', 'category',
            'salary_range', 'job_type',
            'location',  
            'timing', 'slots', 'is_active',
            'created_at',
        ]
        read_only_fields = ['employer', 'created_at']

    def validate_slots(self, value):
        if value is not None and value < 1:
            raise serializers.ValidationError("Slots must be at least 1.")
        return value