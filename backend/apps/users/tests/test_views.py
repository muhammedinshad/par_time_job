from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
from apps.users.models import User, OTP



class SendOTPViewTest(APITestCase):

    @patch('apps.users.views.send_email_otp')
    def test_send_otp_success(self, mock_send_email):

        url = reverse('send-otp')

        data = {
            'email': 'test@gmail.com',
            'role': 'employer'
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'OTP send')

        otp_exists = OTP.objects.filter(email='test@gmail.com').exists()

        self.assertTrue(otp_exists)

    def test_send_otp_invalid_email(self):

        url = reverse('send-otp')

        data = {
            'email': 'invalid-email',
            'role': 'employer'
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_send_otp_without_role(self):

        url = reverse('send-otp')

        data = {
            'email': 'test@gmail.com'
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
        
        
class VerifyOTPViewTest(APITestCase):

    def test_jobseeker_registration_invalid_gender(self):

        url = reverse('register-jobseeker')

        data = {
            'email': 'job@gmail.com',
            'password': 'Test@123',
            'role': 'job_seeker',
            'full_name': 'Inshad',
            'date_of_birth': '2003-01-01',
            'gender': 'invalid',
            'current_location': 'Kozhikode',
            'phone_number': '9876543211'
        }

        response = self.client.post(url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )
        
        
        
    class EmployerRegisterViewTest(APITestCase):

        url = reverse('register-employer')

        data = {
            'email': 'employer@gmail.com',
            'password': 'Test@123',
            'role': 'employer',
            'business_name': 'Prime Cafe',
            'business_type': 'restaurant',
            'location': 'Kozhikode',
            'phone_number': '9876543210'
        }

       

        
    def test_employer_registration_duplicate_email(self):

        User.objects.create_user(
            email='employer@gmail.com',
            password='Test@123'
        )

        url = reverse('register-employer')

        data = {
            'email': 'employer@gmail.com',
            'password': 'Test@123',
            'role': 'employer',
            'business_name': 'Prime Cafe',
            'business_type': 'restaurant',
            'location': 'Kozhikode',
            'phone_number': '9876543210'
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



class JobSeekerRegisterViewTest(APITestCase):

    def test_jobseeker_registration_success(self):

        url = reverse('register-jobseeker')

        data = {
            'email': 'job@gmail.com',
            'password': 'Test@123',
            'confirm_password': 'Test@123',
            'role': 'job_seeker',
            'full_name': 'Inshad',
            'date_of_birth': '2003-01-01',
            'gender': 'male',
            'current_location': 'Kozhikode',
            'phone_number': '9876543211'
           
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['role'], 'job_seeker')

    def test_jobseeker_registration_invalid_gender(self):

        url = reverse('register-jobseeker')

        data = {
            'email': 'job@gmail.com',
            'password': 'Test@123',
            'confirm_password': 'Test@123',
            'role': 'job_seeker',
            'full_name': 'Inshad',
            'date_of_birth': '2003-01-01',
            'phone_number': '9876543211',
            'gender': 'invalid',
            'current_location': 'Kozhikode'
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)




class EmployerRegisterViewTest(APITestCase):

    def test_employer_registration_success(self):

        url = reverse('register-employer')

        data = {
            'email': 'employer@gmail.com',
            'password': 'Test@123',
            'confirm_password': 'Test@123',
            'role': 'employer',
            'business_name': 'Prime Cafe',
            'business_type': 'restaurant',
            'location': 'Kozhikode',
            'phone_number': '9876543210'
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['role'], 'employer')

    def test_employer_registration_duplicate_email(self):

        User.objects.create_user(
            email='employer@gmail.com',
            password='Test@123'
        )

        url = reverse('register-employer')

        data = {
            'email': 'employer@gmail.com',
            'password': 'Test@123',
            'confirm_password': 'Test@123',
            'role': 'employer',
            'business_name': 'Prime Cafe',
            'business_type': 'restaurant',
            'location': 'Kozhikode',
            'phone_number': '9876543210'
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



class LoginViewTest(APITestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            email='login@gmail.com',
            password='Test@123',
            role='job_seeker'
        )

    def test_login_success(self):

        url = reverse('login')

        data = {
            'email': 'login@gmail.com',
            'password': 'Test@123'
        }

        response = self.client.post(url, data)
     
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)

    def test_login_wrong_password(self):

        url = reverse('login')

        data = {
            'email': 'login@gmail.com',
            'password': 'WrongPassword'
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_non_existing_user(self):

        url = reverse('login')

        data = {
            'email': 'wrong@gmail.com',
            'password': 'Test@123'
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)