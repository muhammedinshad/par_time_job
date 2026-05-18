from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmployerProfile, JobSeekerProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ('email', 'role', 'is_active', 'is_staff', 'is_verified', 'created_at')
    list_filter   = ('role', 'is_active', 'is_staff', 'is_verified')
    search_fields = ('email',)
    ordering      = ('-created_at',)

    fieldsets = (
        (None,        {'fields': ('email', 'password')}),
        ('Role',      {'fields': ('role',)}),
        ('Status',    {'fields': ('is_active', 'is_staff', 'is_verified')}),
        ('Permissions', {'fields': ('is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields':  ('email', 'password1', 'password2', 'role', 'is_staff', 'is_verified'),
        }),
    )


@admin.register(EmployerProfile)
class EmployerProfileAdmin(admin.ModelAdmin):
    list_display  = ('business_name', 'business_type', 'location', 'phone_number', 'created_at')
    list_filter   = ('business_type',)
    search_fields = ('business_name', 'location', 'phone_number', 'user__email')
    raw_id_fields = ('user',)


@admin.register(JobSeekerProfile)
class JobSeekerProfileAdmin(admin.ModelAdmin):
    list_display  = ('full_name', 'gender', 'current_location', 'phone_number', 'created_at')
    list_filter   = ('gender',)
    search_fields = ('full_name', 'current_location', 'phone_number', 'user__email')
    raw_id_fields = ('user',)
