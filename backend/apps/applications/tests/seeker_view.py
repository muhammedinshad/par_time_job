from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.jobs.models import Job
from apps.applications.models import Application
from apps.job_seekers.models import JobSeekerProfile
from apps.employers.models import EmployerProfile
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()


class ApplyToJobViewTest(APITestCase):

    def setUp(self):

        # Employer user
        self.employer_user = User.objects.create_user(
            email='employer@test.com',
            password='test123'
        )

        self.employer = EmployerProfile.objects.create(
            user=self.employer_user,
            business_name='Test Company'
        )

        # Job seeker user
        self.seeker_user = User.objects.create_user(
            email='seeker@test.com',
            password='test123'
        )

        self.seeker = JobSeekerProfile.objects.create(
            user=self.seeker_user,
            full_name='Test User'
        )

        # Job
        self.job = Job.objects.create(
            employer=self.employer,
            title='Delivery Boy',
            category='delivery',
            is_active=True,
            slots=5
        )

        # URL
        self.url = reverse('apply-to-job')

    def test_apply_job_successfully(self):

        self.client.force_authenticate(user=self.seeker_user)

        license_photo = SimpleUploadedFile(
            "license.jpg",
            b"file_content",
            content_type="image/jpeg"
        )

        cv_file = SimpleUploadedFile(
            "cv.pdf",
            b"dummy_cv",
            content_type="application/pdf"
        )

        data = {
            'job': self.job.id,
            'cover_note': 'I am interested',
            'has_vehicle': True,
            'license_photo': license_photo,
            'cv_snapshot': cv_file
        }

        response = self.client.post(self.url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), 1)

    def test_apply_without_cv_should_fail(self):

        self.client.force_authenticate(user=self.seeker_user)

        license_photo = SimpleUploadedFile(
            "license.jpg",
            b"file_content",
            content_type="image/jpeg"
        )

        data = {
            'job': self.job.id,
            'has_vehicle': True,
            'license_photo': license_photo,
        }

        response = self.client.post(self.url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cv_snapshot', response.data)

    def test_duplicate_application_should_fail(self):

        self.client.force_authenticate(user=self.seeker_user)

        Application.objects.create(
            job=self.job,
            seeker=self.seeker
        )

        cv_file = SimpleUploadedFile(
            "cv.pdf",
            b"dummy_cv",
            content_type="application/pdf"
        )

        license_photo = SimpleUploadedFile(
            "license.jpg",
            b"file_content",
            content_type="image/jpeg"
        )

        data = {
            'job': self.job.id,
            'has_vehicle': True,
            'license_photo': license_photo,
            'cv_snapshot': cv_file
        }

        response = self.client.post(self.url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_apply_inactive_job_should_fail(self):

        self.client.force_authenticate(user=self.seeker_user)

        self.job.is_active = False
        self.job.save()

        cv_file = SimpleUploadedFile(
            "cv.pdf",
            b"dummy_cv",
            content_type="application/pdf"
        )

        license_photo = SimpleUploadedFile(
            "license.jpg",
            b"file_content",
            content_type="image/jpeg"
        )

        data = {
            'job': self.job.id,
            'has_vehicle': True,
            'license_photo': license_photo,
            'cv_snapshot': cv_file
        }

        response = self.client.post(self.url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)