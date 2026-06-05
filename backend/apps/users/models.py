from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone
from datetime import timedelta

from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email required')
        email = self.normalize_email(email)
        user  = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password=password, **extra_fields)
    

class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = [
        ('employer',   'Employer'),
        ('job_seeker', 'Job Seeker'),
        ('admin','Admin'),
    ]

  
    email        = models.EmailField(unique=True)
    role         = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True, default="")
    is_active    = models.BooleanField(default=True)
    is_staff     = models.BooleanField(default=False) 
    is_verified  = models.BooleanField(default=False) 
    created_at   = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"



BUSINESS_TYPE_CHOICES = [
    ('restaurant',  'Restaurant'),
    ('events',      'Events'),
    ('health_care', 'Health Care'),
    ('software_development', 'Software Development'),
    ('other',       'Other'),
]

GENDER_CHOICES = [
    ('male',   'Male'),
    ('female', 'Female'),
    ('other',  'Other'),
]




class EmployerProfile(models.Model):
    user          = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    business_name = models.CharField(max_length=200)
    business_type = models.CharField(max_length=50, choices=BUSINESS_TYPE_CHOICES)
    location      = models.CharField(max_length=200)
    created_at    = models.DateTimeField(auto_now_add=True)
    description   =  models.TextField(blank=True, default='')
    phone_number = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.business_name
    
    
class JobSeekerProfile(models.Model):
    user             = models.OneToOneField(User, on_delete=models.CASCADE, related_name='job_seeker_profile')
    full_name        = models.CharField(max_length=100)
    date_of_birth    = models.DateField()
    gender           = models.CharField(max_length=20, choices=GENDER_CHOICES)
    current_location = models.CharField(max_length=200)
    coordinates      = gis_models.PointField(srid=4326, null=True, blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)
    phone_number = models.CharField(max_length=10, unique=True)
    cv = models.FileField(
        upload_to='cvs/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(['pdf', 'doc', 'docx'])]
    )

    def __str__(self):
        return self.full_name