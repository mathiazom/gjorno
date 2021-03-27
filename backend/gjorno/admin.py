"""Admin site configurations"""

from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.sites.models import Site
from allauth.account.models import EmailAddress
from django.db.models import Count

from .models import Activity, Registration, Category, Image, Profile, Log, Favorite


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    """Admin config for Activity model"""
    list_display = ('title', 'user', 'has_registration', 'is_organization', 'total_unique_views', 'total_favorites',
                    'total_registrations')
    search_fields = ('title', 'user__username')
    list_filter = ('has_registration', 'user__profile__is_organization')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        # Define derived fields
        queryset = queryset.annotate(
            total_unique_views=Count("users_viewed"),
            total_favorites=Count("favorites"),
            total_registrations=Count("registrations")
        )
        return queryset

    def is_organization(self, obj):
        return bool(obj.user.profile.is_organization)

    is_organization.boolean = True

    def total_unique_views(self, obj):
        return obj.total_unique_views

    total_unique_views.admin_order_field = "total_unique_views"

    def total_favorites(self, obj):
        return obj.total_favorites

    total_favorites.admin_order_field = "total_favorites"

    def total_registrations(self, obj):
        if obj.has_registration:
            return obj.total_registrations

    total_registrations.admin_order_field = "total_registrations"


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    """Admin config for Image model"""
    list_display = ('title', 'image')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Admin config for Profile model"""
    list_display = ('user', 'phone_number', 'is_organization')


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    """Admin config for Favorite model"""
    list_display = ('user', 'activity', 'timestamp')


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    """Admin config for Registration model"""
    list_display = ('user', 'activity')


admin.site.register(Category)
admin.site.register(Log)

# Hide unused models
admin.site.unregister(Group)
admin.site.unregister(Site)
admin.site.unregister(EmailAddress)
