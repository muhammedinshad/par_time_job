from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialAccount

class CustomGoogleAdapter(DefaultSocialAccountAdapter):
    """
    This function is automatically called when a user 
    is created after a Google login.
    """

    def save_user(self, request, sociallogin, form=None):
        # 1. Default allauth save — Creates the User object
        user = super().save_user(request, sociallogin, form)

        # 2. Raw data received from Google
        google_data = sociallogin.account.extra_data

        # KEY FIX — Check if the social account already exists
        already_exists = SocialAccount.objects.filter(
            user=user, provider='google'
        ).exists()
        
        if already_exists:
            return user

        user.role = ''
        user.is_verified = True   
        user.save()

        # Store the full name from Google in the session
        request.session['google_full_name'] = google_data.get('name', '')

        return user