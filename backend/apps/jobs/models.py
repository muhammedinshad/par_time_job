from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
from django.db import models
from apps.users.models import EmployerProfile
from ..common.geocoding import geocode_location 

# Create your models here.

JOB_TYPE_CHOICES = [
    ('full_time',  'Full Time'),
    ('part_time',  'Part Time'),
    ('contract',   'Contract'),
    ('internship', 'Internship'),
]

CATEGORY_CHOICES = [
    ('restaurant',  'Restaurant & Food'),
    ('events',      'Events & Entertainment'),
    ('health_care', 'Health & Care'),
    ('education',   'Education & Tutoring'),
    ('delivery', 'Delivery'),
    ('software_development','Software Development'),
    ('other',       'Other'),
]


class Job(models.Model):
    employer     = models.ForeignKey(EmployerProfile,on_delete=models.CASCADE,related_name='jobs')
    title        = models.CharField(max_length=200)
    description  = models.TextField()
    category     = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    salary_range = models.CharField(max_length=100, blank=True, default='')
    job_type     = models.CharField(max_length=10, choices=JOB_TYPE_CHOICES)
    location     = models.CharField(max_length=200)   
    coordinates  = gis_models.PointField(srid=4326, null=True, blank=True)       
    timing       = models.CharField(max_length=200)
    slots        = models.PositiveIntegerField(blank=True, null=True)  
    is_active    = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        # auto convert the text "Kozhikode" → lat/lng 
        if self.location and not self.coordinates:
            lat, lng = geocode_location(self.location)
            if lat and lng:
                self.coordinates = Point(lng, lat, srid=4326)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} — {self.employer.business_name}"