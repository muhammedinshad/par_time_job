from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .utils import generate_and_store_otp, verify_otp,get_tokens
from allauth.socialaccount.models import SocialAccount,SocialLogin
from allauth.socialaccount.helpers import complete_social_login
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import redirect as django_redirect
from urllib.parse import urlencode
from urllib.parse import urlencode

from .models import User,EmployerProfile,JobSeekerProfile
from .serializers import (
    SendOTPSerializer, VerifyOTPSerializer,
    EmployerRegisterSerializer, JobSeekerRegisterSerializer,
    LoginSerializer,JobSeekerProfileSerializer,EmployerProfileSerializer,
    ResetPasswordSerializer,EmployerProfileUpdateSerializer,JobSeekerProfileUpdateSerializer,
    GoogleCompleteProfileSerializer,GoogleEmployerProfileSerializer,GoogleJobSeekerProfileSerializer
)
    
    
def send_email_otp(email, otp):
    """Gmail will send the OTP using SMTP"""
    try:
        send_mail(
            subject    = 'PrimeJob — Your OTP Code',
            message    = f'Your OTP is: {otp}\n\nThis OTP is valid for 5 minutes.',
            from_email = settings.EMAIL_HOST_USER,
            recipient_list = [email],
            fail_silently  = False,
        )

    except Exception as e:
            return Response(
                {
                    "error": "Something went wrong",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class SendOTPView(APIView):
    def post(self, request):
        try:
            serializer = SendOTPSerializer(data=request.data)
            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            email = serializer.validated_data['email']
            role  = serializer.validated_data['role']

            # Redis-il store cheyyum, DB touch cheyyilla
            otp = generate_and_store_otp(email, role)
            send_email_otp(email, otp)

            return Response(
                {'message': 'OTP sent', 'email': email},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyOTPView(APIView):
    def post(self, request):
        try:
            serializer = VerifyOTPSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            email    = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']

            # Redis check — valid aanel role return cheyyum, invalid/expired aanel None
            role = verify_otp(email, otp_code)

            if role is None:
                return Response(
                    {'error': 'Invalid or expired OTP'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {'message': 'OTP verified!', 'email': email, 'role': role, 'otp_verified': True},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class EmployerRegisterView(APIView):
    """Employer registration"""

    def post(self, request):
        try:
            serializer = EmployerRegisterSerializer(data=request.data)
            if serializer.is_valid():
                user   = serializer.save()
                tokens = get_tokens(user)
                
                response = Response({
                    'message':  'Employer registration successful!',
                    'role':     user.role,
                    'email':    user.email,
                    'tokens':   tokens,
                }, status=status.HTTP_201_CREATED)

                response.set_cookie(
                    key      = 'access_token',
                    value    = tokens['access'],
                    httponly = True,
                    secure   = False,
                    samesite = 'Lax',
                    max_age  = 60 * 5
                )
                response.set_cookie(
                    key      = 'refresh_token',
                    value    = tokens['refresh'],
                    httponly = True,
                    secure   = False,
                    samesite = 'Lax',
                    max_age  = 60 * 60 * 24 * 7
                )
                return response

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response(
                {
                    "error": "Something went wrong in EmployerRegisterView",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class JobSeekerRegisterView(APIView):
    """Job Seeker registration"""

    def post(self, request):
        try:
            serializer = JobSeekerRegisterSerializer(data=request.data)
            if serializer.is_valid():
                user   = serializer.save()
                tokens = get_tokens(user)

                response = Response({
                    'message': 'Job Seeker registration successful!',
                    'role':    user.role,
                    'email':   user.email,
                    'tokens':  tokens,
                }, status=status.HTTP_201_CREATED)

                response.set_cookie(
                    key      = 'access_token',
                    value    = tokens['access'],
                    httponly = True,
                    secure   = False,
                    samesite = 'Lax',
                    max_age  = 60 * 5
                )
                response.set_cookie(
                    key      = 'refresh_token',
                    value    = tokens['refresh'],
                    httponly = True,
                    secure   = False,
                    samesite = 'Lax',
                    max_age  = 60 * 60 * 24 * 7
                )
                return response

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response(
                {
                    "error": "Something went wrong in JobSeekerRegisterView",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoginView(APIView):
    """Email + Password """

    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                user   = serializer.validated_data['user']
                tokens = get_tokens(user)
                
                response = Response({
                    'message': 'Login successful!',
                    'role':    user.role,
                    'email':   user.email,
                }, status=status.HTTP_200_OK)
                
                response.set_cookie(
                    key      = 'access_token',
                    value    = tokens['access'],
                    httponly = True,   
                    secure   = False,   
                    samesite = 'Lax', 
                    max_age  = 60 * 5  # 5 minutes
                )
                
                response.set_cookie(
                    key      = 'refresh_token',
                    value    = tokens['refresh'],
                    httponly = True,
                    secure   = False,
                    samesite = 'Lax',
                    max_age  = 60 * 60 * 24 * 7  # 7 days
                )
                return response

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response(
                {
                    "error": "Something went wrong in LoginView",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

class CookieTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return Response(
                {'error': 'Refresh token not found'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            token = RefreshToken(refresh_token)
            new_access = str(token.access_token)

            response = Response({'message': 'Token refreshed!'})
            response.set_cookie(
                key      = 'access_token',
                value    = new_access,
                httponly = True,
                secure   = False,
                samesite = 'Lax',
                max_age  = 60 * 5
            )
            return response

        except (TokenError, InvalidToken):
            return Response(
                {'error': 'Invalid refresh token'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try :
            user = request.user
            if user.role == "employer":
                data = EmployerProfile.objects.get(user=user)
                serializer = EmployerProfileSerializer(data)
                
            elif user.role == "job_seeker":
                data = JobSeekerProfile.objects.get(user=user)
                serializer = JobSeekerProfileSerializer(data)

            else:
                return Response(
                    {'error': 'Invalid role'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except EmployerProfile.DoesNotExist:
            return Response(
                {'error': 'Employer profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except JobSeekerProfile.DoesNotExist:
            return Response(
                {'error': 'Job seeker profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )      
        except Exception as e:
            return Response(
                 {
                    "error": "Something went wrong in ProfileView",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        try :
            refresh_token = request.COOKIES.get('refresh_token')
            
            if refresh_token: 
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            response = Response(
                {'message': 'Logout successful!'},
                status=status.HTTP_200_OK
            )
            
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response
           
        except Exception as e:
            return Response({'error': 'Invalid token', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
class ForgotPasswordRequestView(APIView):
    """Step 1 — Email kodukuka, OTP anakkunnu"""

    def post(self, request):
        try:
            email = request.data.get('email')

            if not email:
                return Response(
                    {'error': 'Email required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # User exist cheyyunundo check
            if not User.objects.filter(email=email).exists():
                return Response(
                    {'error': 'No account found with this email'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Already existing OTP system reuse 
            otp = generate_and_store_otp(email, role='reset')
            send_email_otp(email, otp)

            return Response(
                {'message': 'OTP sent to email', 'email': email},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ResetPasswordView(APIView):
    """Step 2 — OTP verify + set new password """

    def post(self, request):
        try:
            serializer = ResetPasswordSerializer(data=request.data)

            # Oro field um validate — error undenkil return
            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            email        = serializer.validated_data['email']
            otp_code     = serializer.validated_data['otp_code']
            new_password = serializer.validated_data['new_password']

            # OTP verify
            role = verify_otp(email, otp_code)
            if role != 'reset':
                return Response(
                    {'otp_code': 'Invalid or expired OTP'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Password update
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()

            return Response(
                {'message': 'Password reset successful!'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

class ProfileUpdateView(APIView):
    permission_classes = []
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request):
        try:
            user = request.user

            if user.role == 'employer':
                profile    = EmployerProfile.objects.get(user=user)
                serializer = EmployerProfileUpdateSerializer(
                    profile,
                    data=request.data,
                    partial=True 
                )

            elif user.role == 'job_seeker':
                profile    = JobSeekerProfile.objects.get(user=user)
                serializer = JobSeekerProfileUpdateSerializer(
                    profile,
                    data=request.data,
                    partial=True
                )

            else:
                return Response(
                    {'error': 'Invalid role'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        'message': 'Profile updated successfully!',
                        'data':    serializer.data
                    },
                    status=status.HTTP_200_OK
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except (EmployerProfile.DoesNotExist, JobSeekerProfile.DoesNotExist):
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

            
#------ Google auth -------



from django.contrib.auth import get_user_model
User = get_user_model()

from rest_framework.authentication import SessionAuthentication

class GoogleCallbackView(APIView):
    permission_classes = []
    # SessionAuthentication is CRITICAL here so DRF can read the user session allauth just created
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        try:
            user = request.user

            if not user or not user.is_authenticated:
                return django_redirect('http://localhost:5174/login?error=google_auth_failed')

            # Generate JWT tokens for frontend
            tokens = get_tokens(user)

            if user.role == 'employer':
                profile_complete = EmployerProfile.objects.filter(user=user).exists()
            elif user.role == 'job_seeker':
                profile_complete = JobSeekerProfile.objects.filter(user=user).exists()
            else:
                profile_complete = False

            # Retrieve Google name if this is a new user (set by adapter)
            suggested_name = request.session.get('google_full_name', '')

            # Pass params to the frontend callback handler
            params = urlencode({
                'email': user.email,
                'role': user.role or '',
                'profile_complete': str(profile_complete).lower(),
                'suggested_name': suggested_name,
                'access_token': tokens['access'],
                'refresh_token': tokens['refresh'],
            })

            # React redirect
            response = django_redirect(f'http://localhost:5174/google/callback?{params}')

            # Set tokens as HTTP-only cookies
            response.set_cookie(
                key='access_token', value=tokens['access'],
                httponly=True, secure=False, samesite='Lax', max_age=60 * 60
            )
            response.set_cookie(
                key='refresh_token', value=tokens['refresh'],
                httponly=True, secure=False, samesite='Lax', max_age=60 * 60 * 24 * 7
            )
            
            return response

        except Exception as e:
            print("GoogleCallbackView ERROR:", str(e))
            return django_redirect(f'http://localhost:5174/login?error={str(e)}')
        
        
class GoogleCompleteProfileView(APIView):
    """
    Saves the role and profile details after a Google login.
    This view works in two logical steps:
      Step 1 — POST the role only
      Step 2 — POST the supplemental profile details
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user

            # Check if this is a Google user
            is_google_user = SocialAccount.objects.filter(
                user=user, provider='google'
            ).exists()

            if not is_google_user:
                return Response(
                    {'error': 'This endpoint is for Google login users only'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Use real DB queries instead of hasattr to check profile existence
            has_employer_profile  = EmployerProfile.objects.filter(user=user).exists()
            has_jobseeker_profile = JobSeekerProfile.objects.filter(user=user).exists()

            if user.role and (has_employer_profile or has_jobseeker_profile):
                return Response(
                    {'error': 'Profile already complete'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Step 1 — Validate the Role
            role_serializer = GoogleCompleteProfileSerializer(data=request.data)
            if not role_serializer.is_valid():
                return Response(
                    role_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            role = role_serializer.validated_data['role']

            # Step 2 — Choose the profile serializer based on the role
            if role == 'employer': 
                profile_serializer = GoogleEmployerProfileSerializer(data=request.data)
                if not profile_serializer.is_valid():
                    return Response(
                        profile_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Save the user's role
                user.role = 'employer'
                user.save()

                # Create EmployerProfile — Using your existing model
                EmployerProfile.objects.create(
                    user          = user,
                    business_name = profile_serializer.validated_data['business_name'],
                    business_type = profile_serializer.validated_data['business_type'],
                    location      = profile_serializer.validated_data['location'],
                    phone_number  = profile_serializer.validated_data['phone_number'],
                    description   = profile_serializer.validated_data.get('description', ''),
                )

            elif role == 'job_seeker':
                profile_serializer = GoogleJobSeekerProfileSerializer(data=request.data)
                if not profile_serializer.is_valid():
                    return Response(
                        profile_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Save the user's role
                user.role = 'job_seeker'
                user.save()

                # Create JobSeekerProfile — Using your existing model
                JobSeekerProfile.objects.create(
                    user             = user,
                    full_name        = profile_serializer.validated_data['full_name'],
                    date_of_birth    = profile_serializer.validated_data['date_of_birth'],
                    gender           = profile_serializer.validated_data['gender'],
                    current_location = profile_serializer.validated_data['current_location'],
                    phone_number     = profile_serializer.validated_data['phone_number'],
                )

            return Response({
                'message':  'Profile complete!',
                'email':    user.email,
                'role':     user.role,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )