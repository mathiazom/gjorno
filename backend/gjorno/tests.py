from django.test import TestCase
from django.contrib.auth.admin import User
from .models import Activity, Category, Profile


class ActivityTest(TestCase):

    def setUp(self):
        self.user = User.objects.create()
        self.activity = Activity.objects.create(
            user=self.user, title="Promenu ĉirkaŭ la lago", description=""
        )

    def test_activity_string(self):
        self.assertEqual(str(self.activity), "Promenu ĉirkaŭ la lago")


class CategoryTest(TestCase):

    def setUp(self):
        self.category = Category.objects.create(title="Atletiko")

    def test_category_string(self):
        self.assertEqual(str(self.category), "Atletiko")


class ProfileTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(first_name="Ludwig", last_name="Zamenhof")
        self.profile = Profile.objects.create(
            user=self.user, phone_number="+4283356789"
        )

    def test_profile_string(self):
        self.assertEqual(str(self.profile), "Ludwig Zamenhof")
