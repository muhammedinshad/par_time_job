from rest_framework import serializers
from django.contrib.auth import authenticate
from ..models import User, EmployerProfile, JobSeekerProfile

class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role         = serializers.ChoiceField(choices=['employer', 'job_seeker'])
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already exists')
        return value
    
class VerifyOTPSerializer(serializers.Serializer):
    email        = serializers.EmailField()
    otp_code     = serializers.CharField(max_length=6)
    
    
#____Employer Registration____

class EmployerRegisterSerializer(serializers.Serializer):
    phone_number  = serializers.CharField(max_length=10)
    business_name = serializers.CharField(max_length=200)
    business_type = serializers.ChoiceField(choices=['restaurant', 'events', 'health_care', 'other'])
    email         = serializers.EmailField()
    location      = serializers.CharField(max_length=200)
    password      = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords dose not match '})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'email already exist'})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        phone         = validated_data.pop('phone_number')
        business_name = validated_data.pop('business_name')
        business_type = validated_data.pop('business_type')
        location      = validated_data.pop('location')

        user = User.objects.create_user(
            email        = validated_data['email'],
            password     = validated_data['password'],
            role         = 'employer',
            is_verified  = True,
        )
        EmployerProfile.objects.create(
            user          = user,
            business_name = business_name,
            business_type = business_type,
            location      = location,
            phone_number = phone,
        )
        return user
    
    
    
# ----- Job Seeker Registration ----
class JobSeekerRegisterSerializer(serializers.Serializer):
    phone_number     = serializers.CharField(max_length=10)
    full_name        = serializers.CharField(max_length=100)
    email            = serializers.EmailField()
    date_of_birth    = serializers.DateField()
    gender           = serializers.ChoiceField(choices=['male', 'female', 'other'])
    current_location = serializers.CharField(max_length=200)
    password         = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords dose not match'})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'email already exist'})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        phone            = validated_data.pop('phone_number')
        full_name        = validated_data.pop('full_name')
        date_of_birth    = validated_data.pop('date_of_birth')
        gender           = validated_data.pop('gender')
        current_location = validated_data.pop('current_location')

        user = User.objects.create_user(
            email        = validated_data['email'],
            password     = validated_data['password'],
            role         = 'job_seeker',
            is_verified  = True,
        )
        JobSeekerProfile.objects.create(
            user             = user,
            full_name        = full_name,
            date_of_birth    = date_of_birth,
            gender           = gender,
            current_location = current_location,
            phone_number     = phone,
        )
        return user
    
    

# ------ Login -------
class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('incorrect email or Password ')
        data['user'] = user
        return data

class EmployerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    role  = serializers.CharField(source='user.role',  read_only=True)

    class Meta:
        model  = EmployerProfile
        fields = [
            'email',
            'role',
            'business_name',
            'business_type',
            'location',
            'phone_number',
            'description',
            'created_at',
        ]


class JobSeekerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    role  = serializers.CharField(source='user.role',  read_only=True)

    class Meta:
        model  = JobSeekerProfile
        fields = [
            'email',
            'role',
            'full_name',
            'date_of_birth',
            'gender',
            'current_location',
            'phone_number',
            'created_at',
            "cv",
        ]
        

class ResetPasswordSerializer(serializers.Serializer):
    email            = serializers.EmailField()
    otp_code         = serializers.CharField(min_length=6, max_length=6)
    new_password     = serializers.CharField(min_length=8)
    confirm_password = serializers.CharField(min_length=8)

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError('No account found with this email')
        return value

    def validate_otp_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError('OTP must contain numbers only')
        return value

    def validate(self, data):
        # Cross-field validation — randu field compare cheyyumbol
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})
        return data
    
    
class EmployerProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = EmployerProfile
        fields = [
            'business_name',
            'business_type',
            'location',
            'phone_number',
            'description',
        ]

    def validate_phone_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError('Phone number must contain numbers only')
        if len(value) != 10:
            raise serializers.ValidationError('Phone number must be 10 digits')
        return value


class JobSeekerProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = JobSeekerProfile
        fields = [
            'full_name',
            'date_of_birth',
            'gender',
            'current_location',
            'phone_number',
            'cv',
        ]

    def validate_phone_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError('Phone number must contain numbers only')
        if len(value) != 10:
            raise serializers.ValidationError('Phone number must be 10 digits')
        return value

    def validate_date_of_birth(self, value):
        from datetime import date
        if value >= date.today():
            raise serializers.ValidationError('Date of birth must be in the past')
        return value
    
    def validate_cv(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError('CV must be under 5MB.')
        return value
    

# ---- Google Auth Serializers ----

class GoogleCompleteProfileSerializer(serializers.Serializer):
    """
    Serializer to select a user role after Google login.
    Only the 'role' field is validated here.
    """
    role = serializers.ChoiceField(choices=['employer', 'job_seeker'])


class GoogleEmployerProfileSerializer(serializers.Serializer):
    """
    Form to be filled if the Google login user is an employer.
    This includes only the fields not provided by Google.
    """
    business_name = serializers.CharField(max_length=200)
    business_type = serializers.ChoiceField( choices=['restaurant', 'events', 'health_care', 'other'])
    location      = serializers.CharField(max_length=200)
    phone_number  = serializers.CharField(max_length=10)
    description   = serializers.CharField(required=False, default='')

    def validate_phone_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError('Phone number must contain numbers only')
        if len(value) != 10:
            raise serializers.ValidationError('Phone number must be 10 digits')
        return value


class GoogleJobSeekerProfileSerializer(serializers.Serializer):
    """
    Form to be filled if the Google login user is a job seeker.
    The full_name is retrieved from Google, but the user must confirm it here.
    """
    full_name        = serializers.CharField(max_length=100)
    date_of_birth    = serializers.DateField()
    gender           = serializers.ChoiceField(choices=['male', 'female', 'other'])
    current_location = serializers.CharField(max_length=200)
    phone_number     = serializers.CharField(max_length=10)

    def validate_phone_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError('Phone number must contain numbers only')
        if len(value) != 10:
            raise serializers.ValidationError('Phone number must be 10 digits')
        return value

    def validate_date_of_birth(self, value):
        from datetime import date
        if value >= date.today():
            raise serializers.ValidationError('Date of birth must be in the past')
        return value
