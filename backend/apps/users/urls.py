from django.urls import path,include
from rest_framework_simplejwt.views import TokenRefreshView
from .views.views import (
    SendOTPView, VerifyOTPView,
    EmployerRegisterView, JobSeekerRegisterView,
    LoginView,LogoutView,CookieTokenRefreshView,ProfileView,
    ForgotPasswordRequestView,ResetPasswordView,ProfileUpdateView,
    GoogleCallbackView,GoogleCompleteProfileView
)
from .views.adminView import AdminUserActionView,AdminUserListView

urlpatterns = [
    path('send-otp/',SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    
    path('register/employer/', EmployerRegisterView.as_view(),name='register-employer'),
    path('register/jobseeker/', JobSeekerRegisterView.as_view(), name='register-jobseeker'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    #------ Google auth ----
    path('accounts/', include('allauth.urls')),
    path('google/callback/', GoogleCallbackView.as_view()),
    path('google/complete-profile/', GoogleCompleteProfileView.as_view()),
    
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),
    
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token-refresh'),
    
    path('forgot-password/', ForgotPasswordRequestView.as_view(), name='forgot-password'),
    path('reset-password/',  ResetPasswordView.as_view(), name='reset-password'),
    
    path('admin/users/',            AdminUserListView.as_view(),   name='admin-user-list'),
    path('admin/users/<int:user_id>/', AdminUserActionView.as_view(), name='admin-user-action'),
]