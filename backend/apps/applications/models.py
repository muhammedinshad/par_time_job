from django.core.validators import FileExtensionValidator
from django.db import models
from apps.jobs.models import Job
from apps.users.models import JobSeekerProfile

QUALIFICATION_CHOICES = [
    ('plus_two', 'Plus Two'),
    ('degree',   'Degree'),
    ('masters',  'Masters'),
    ('diploma',  'Diploma'),
    ('other',    'Other'),
]

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending',  'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    job    = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    seeker = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    # Common — fields
    cover_note     = models.TextField(blank=True, default='')
    cv_snapshot    = models.FileField(
        upload_to='cvs/applications/',
        null=True,
        blank=True,
    )

    # Delivery
    has_vehicle   = models.BooleanField(null=True, blank=True)  
    license_photo = models.ImageField(                          
        upload_to='applications/licenses/',
        null=True,
        blank=True,
    )

    # Teaching 
    qualification = models.CharField(
        max_length=20,
        choices=QUALIFICATION_CHOICES,
        null=True,
        blank=True,
    )
    
    experience_details = models.TextField(blank=True, null=True)

    # Health Care 
    health_certificate = models.FileField(
        upload_to='applications/health_docs/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(['pdf', 'doc', 'docx', 'jpg', 'png'])]
    )

    employer_note = models.TextField(blank=True, null=True)
    applied_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('job', 'seeker')
        ordering        = ['-applied_at']

    def __str__(self):
        return f"{self.seeker.full_name} → {self.job.title} [{self.status}]"