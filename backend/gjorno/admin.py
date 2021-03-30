"""Admin site configurations"""

from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.auth.admin import User
from rest_framework.authtoken.models import Token
from django.db.models import Count, Case, When, Q, Value

from .models import Activity, Registration, Category, Image, Profile, Log, Favorite


class GjornoAdminSite(AdminSite):
    index_title = "Innholdsbehandling for gjorno.site"

    def get_app_list(self, request):
        """
        Return a sorted list of all the installed apps that have been
        registered in this site.
        """
        app_dict = self._build_app_dict(request)

        if 'auth' in app_dict and 'authtoken' in app_dict:
            # Merge auth and authtoken models
            app_dict["auth"]["models"] += app_dict.pop("authtoken")["models"]

        return app_dict.values()


gjorno_admin_site = GjornoAdminSite()


@admin.register(Activity, site=gjorno_admin_site)
class ActivityAdmin(admin.ModelAdmin):
    """Admin config for Activity model"""
    list_display = ('title', 'user', 'has_registration', 'is_organization', 'total_unique_views', 'total_favorites',
                    'total_registrations')
    search_fields = ('title', 'user__username')
    list_filter = ('has_registration', 'user__profile__is_organization')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        # Define calculated fields
        queryset = queryset.annotate(
            count_unique_views=Count('users_viewed', distinct=True),
            count_favorites=Count('favorites', distinct=True),
            count_registrations=Case(
                When(
                    Q(has_registration=False),
                    then=None
                ),
                default=Count('registrations', distinct=True)
            )
        )
        return queryset

    def is_organization(self, obj):
        return bool(obj.user.profile.is_organization)

    is_organization.boolean = True

    def total_unique_views(self, obj):
        return obj.count_unique_views

    total_unique_views.admin_order_field = "count_unique_views"

    def total_favorites(self, obj):
        return obj.count_favorites

    total_favorites.admin_order_field = "count_favorites"

    def total_registrations(self, obj):
        return obj.count_registrations

    total_registrations.admin_order_field = "count_registrations"


@admin.register(Profile, site=gjorno_admin_site)
class ProfileAdmin(admin.ModelAdmin):
    """Admin config for Profile model"""
    list_display = ('user', 'phone_number', 'is_organization', 'total_activities_viewed', 'total_registrations',
                    'total_favorites')
    search_fields = ('title', 'user__username')
    list_filter = ('is_organization',)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        # Define calculated fields
        queryset = queryset.annotate(
            total_activities_viewed=Count("user__activities_viewed", distinct=True),
            total_favorites=Count("user__favorites", distinct=True),
            total_registrations=Count("user__registrations", distinct=True)
        )
        return queryset

    def total_activities_viewed(self, obj):
        return obj.total_activities_viewed

    total_activities_viewed.admin_order_field = "total_activities_viewed"

    def total_registrations(self, obj):
        return obj.total_registrations

    total_registrations.admin_order_field = "total_registrations"

    def total_favorites(self, obj):
        return obj.total_favorites

    total_favorites.admin_order_field = "total_favorites"


@admin.register(Image, site=gjorno_admin_site)
class ImageAdmin(admin.ModelAdmin):
    """Admin config for Image model"""
    list_display = ('title', 'image')


@admin.register(Favorite, site=gjorno_admin_site)
class FavoriteAdmin(admin.ModelAdmin):
    """Admin config for Favorite model"""
    list_display = ('user', 'activity', 'timestamp')


@admin.register(Registration, site=gjorno_admin_site)
class RegistrationAdmin(admin.ModelAdmin):
    """Admin config for Registration model"""
    list_display = ('user', 'activity')


gjorno_admin_site.register(Category)
gjorno_admin_site.register(Log)

gjorno_admin_site.register(User)
gjorno_admin_site.register(Token)
