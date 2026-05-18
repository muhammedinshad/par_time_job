from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class CustomGoogleAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        is_new = not sociallogin.is_existing
        user = super().save_user(request, sociallogin, form)

        if is_new:
            user.role = ''
            user.is_verified = True
            user.save()
            
            # Store google name in session ONLY for new users to prefill the profile
            google_data = sociallogin.account.extra_data
            request.session['google_full_name'] = google_data.get('name', '')
            request.session.modified = True

        return user