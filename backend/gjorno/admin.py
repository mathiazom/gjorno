"""Admin site configurations"""

from django.contrib import admin
from .models import Activity, Registration, Category, Profile


class ProfileAdmin(admin.ModelAdmin):
    """Admin config for Profile model"""
    list_display = ('user', 'phone_number','is_organization')


class ActivityAdmin(admin.ModelAdmin):
    """Admin config for Activity model"""
    list_display = ('title', 'user',)


class RegistrationAdmin(admin.ModelAdmin):
    """Admin config for Registration model"""
    list_display = ('activity', 'user',)


class CategoryAdmin(admin.ModelAdmin):
    """Admin config for Category model"""
    list_display = ('title',)


admin.site.register(Profile, ProfileAdmin)
admin.site.register(Activity, ActivityAdmin)
admin.site.register(Registration, RegistrationAdmin)
admin.site.register(Category, CategoryAdmin)
