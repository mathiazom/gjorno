"""
Unit tests for models and related views
"""

from django.test import TestCase
from django.contrib.auth.admin import User
from .models import Activity, Category, Profile


class ActivityTest(TestCase):
    """Testing activity model"""

    def setUp(self):
        self.user = User.objects.create()
        self.activity = Activity.objects.create(
            user=self.user, title="Promenu ĉirkaŭ la lago", description=""
        )

    def test_activity_string(self):
        """Make sure string is correct"""
        self.assertEqual(str(self.activity), "Promenu ĉirkaŭ la lago")


class CategoryTest(TestCase):
    """Testing category model"""

    def setUp(self):
        self.category = Category.objects.create(title="Atletiko")

    def test_category_string(self):
        """Make sure string is correct"""
        self.assertEqual(str(self.category), "Atletiko")


class ProfileTest(TestCase):
    """Testing profile model"""

    def setUp(self):
        self.user = User.objects.create(first_name="Ludwig", last_name="Zamenhof")
        self.profile = Profile.objects.create(
            user=self.user, phone_number="+4283356789"
        )

    def test_profile_string(self):
        """Make sure string is correct"""
        self.assertEqual(str(self.profile), "Ludwig Zamenhof")
