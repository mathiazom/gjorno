from django.db import models
from django.contrib.auth.admin import User


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user", verbose_name="User")
    phone_number = models.CharField(max_length=11)

    def __str__(self):
        return self.user.get_full_name()


class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_activities", verbose_name="Creator")
    title = models.CharField(max_length=50)
    description = models.TextField()
    categories = models.ManyToManyField(blank=False, null=False, to="gjorno.Category")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Activities"


class Category(models.Model):
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Categories"
