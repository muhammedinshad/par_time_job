from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'id','title','employer','category',
        'job_type','location','slots','is_active',
        'created_at',
    )

    list_filter = (
        'category','job_type',
        'is_active','created_at',
    )

    search_fields = (
        'title',
        'location',
        'employer__business_name',
    )

    ordering = ('-created_at',)