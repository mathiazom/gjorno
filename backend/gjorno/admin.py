from django.contrib import admin
from .models import Activity, Category, Profile


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user',)


class ActivityAdmin(admin.ModelAdmin):
    list_display = ('title', 'user',)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title',)


admin.site.register(Profile, ProfileAdmin)
admin.site.register(Activity, ActivityAdmin)
admin.site.register(Category, CategoryAdmin)
