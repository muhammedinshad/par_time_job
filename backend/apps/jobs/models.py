from django.db import models
from apps.users.models import EmployerProfile

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
    timing       = models.CharField(max_length=200)
    slots        = models.PositiveIntegerField(blank=True, null=True)  
    is_active    = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} — {self.employer.business_name}"