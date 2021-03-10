"""
The basic models that make up the database schema
"""

from django.db import models
from django.contrib.auth.admin import User


class Profile(models.Model):
    """Model acting as an extension of the default User model"""
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile", verbose_name="User"
    )
    phone_number = models.CharField(max_length=11)

    def __str__(self):
        return self.user.get_full_name()


class Activity(models.Model):
    """Model representing an activity created by the user"""

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_activities", verbose_name="Creator"
    )
    title = models.CharField(max_length=50)
    ingress = models.TextField(max_length=240, null=False, blank=False)
    description = models.TextField()
    categories = models.ManyToManyField(blank=False, to="gjorno.Category")

    has_registration = models.BooleanField(default=False)
    registration_capacity = models.PositiveSmallIntegerField(blank=True, null=True)
    registration_deadline = models.DateTimeField(blank=True, null=True)
    starting_time = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=150, blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Activities"


class Category(models.Model):
    """Generic category for the Activity model"""
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Categories"
