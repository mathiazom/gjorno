"""
Unit tests for models and related views
"""

from django.test import TestCase
from django.contrib.auth.admin import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from rest_framework.utils import json

from .models import Activity, Category, Profile
from .serializers import ActivitySerializer


class ActivityTest(TestCase):
    """Testing activity model"""

    def setUp(self):
        self.user = User.objects.create(username="zamenhof59")
        self.profile = Profile.objects.create(user=self.user, phone_number="+4712345678")
        self.categories = [
            Category.objects.create(title=f"Test Category {i}") for i in range(3)
        ]
        token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    def test_activity_string(self):
        """Make sure string is correct"""
        self.activity = Activity.objects.create(
            user=self.user, title="Promenu ĉirkaŭ la lago", description=""
        )
        self.assertEqual(str(self.activity), "Promenu ĉirkaŭ la lago")

    def test_retrieve_activities(self):
        """Make sure created activities can be retrieved with correct fields"""
        # Create dummy activities
        for i in range(1, 5):
            activity = Activity.objects.create(
                user=self.user, title=f"Promenu ĉirkaŭ la lago {i}",
                description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            )
            activity.categories.set([1, 3])
        # Request activity retrieval (without auth)
        client = APIClient()
        response = client.get('/api/activities/')
        # Check that each activity in json response matches original
        json_response = json.loads(response.content)
        for i in range(4, 0, -1):
            self.assertDictEqual(
                json_response[4 - i],
                {
                    "id": i,
                    "title": f"Promenu ĉirkaŭ la lago {i}",
                    "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
                    "categories": [1, 3],
                    "user": self.user.id,
                    "username": "zamenhof59",
                    "has_registration": False,
                }
            )

    def test_retrieve_activities_with_registration(self):
        """Make sure created activities (with registration) can be retrieved with correct fields"""
        # Create dummy activities
        for i in range(1, 5):
            activity = Activity.objects.create(
                user=self.user, title=f"Promenu ĉirkaŭ la lago {i}",
                description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
                has_registration=True, registration_capacity=10, registration_deadline="2022-03-17T15:20:24Z",
                starting_time="2022-03-23T15:20:34Z", location="T-Town"
            )
            activity.categories.set([1, 3])
        # Request activity retrieval
        client = APIClient()
        response = client.get('/api/activities/')
        # Check that each activity in json response matches original
        json_response = json.loads(response.content)
        for i in range(4, 0, -1):
            self.assertDictEqual(
                json_response[4 - i],
                {
                    "id": i,
                    "title": f"Promenu ĉirkaŭ la lago {i}",
                    "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
                    "categories": [1, 3],
                    "user": self.user.id,
                    "username": "zamenhof59",
                    "has_registration": True,
                    "registration_capacity": 10,
                    "registration_deadline": "2022-03-17T15:20:24Z",
                    "starting_time": "2022-03-23T15:20:34Z",
                    "location": "T-Town"
                }
            )

    def test_post_activity(self):
        # Request creation of activity
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3]
        })
        # Check that activity was created successfully
        self.assertEqual(response.status_code, 201)
        self.assertDictEqual(json.loads(response.content), {
            "id": 1,
            "title": "Promenu ĉirkaŭ la lago",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": False,
            "registration_capacity": None,
            "registration_deadline": None,
            "starting_time": None,
            "location": None
        })

    def test_post_activity_with_registration_missing_all_fields(self):
        # Request creation of activity with registration, but without fields
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": True
        })
        # Check that creation failed
        self.assertEqual(response.status_code, 400)
        # Check that failed fields are the missing registration fields
        self.assertDictEqual(
            json.loads(response.content),
            {
                k: ["This field is required when has_registration is true"]
                for k in ["registration_capacity", "registration_deadline", "starting_time", "location"]
            }
        )

    def test_post_activity_with_registration_missing_field(self):
        # Request creation of activity with registration, but without capacity field
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": True,
            "registration_deadline": "2022-03-17T15:20:24Z",
            "starting_time": "2022-03-23T15:20:34Z",
            "location": "T-Town"
        })
        # Check that creation failed
        self.assertEqual(response.status_code, 400)
        # Check that failed fields are the missing registration fields
        self.assertDictEqual(
            json.loads(response.content),
            {
                "registration_capacity": ["This field is required when has_registration is true"]
            }
        )

    def test_post_activity_dates_in_past(self):
        # Request creation of activity with registration, but where dates are in the past
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": True,
            "registration_capacity": 12,
            "registration_deadline": "2019-03-17T15:20:24Z",
            "starting_time": "2019-03-23T15:20:34Z",
            "location": "T-Town"
        })
        # Check that creation failed
        self.assertEqual(response.status_code, 400)
        # Check that failed fields are the missing registration fields
        self.assertDictEqual(
            json.loads(response.content),
            {
                k: ["Should not be in the past"]
                for k in ["registration_deadline", "starting_time"]
            }
        )

    def test_post_activity_deadline_after_start(self):
        # Request creation of activity with registration, but where the activity starts before deadline
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": True,
            "registration_capacity": 12,
            "registration_deadline": "2022-03-17T15:20:24Z",
            "starting_time": "2022-03-16T15:20:34Z",
            "location": "T-Town"
        })
        # Check that creation failed
        self.assertEqual(response.status_code, 400)
        # Check that failed fields are the missing registration fields
        self.assertDictEqual(
            json.loads(response.content),
            {
                "registration_deadline": ["Deadline should not be after starting time"]
            }
        )

    def test_post_activity_with_registration(self):
        # Request creation of activity with registration, with all fields valid
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": True,
            "registration_capacity": 12,
            "registration_deadline": "2022-03-15T15:20:24Z",
            "starting_time": "2022-03-16T15:20:34Z",
            "location": "T-Town"
        })
        # Check that creation failed
        self.assertEqual(response.status_code, 201)
        # Check that failed fields are the missing registration fields
        self.assertDictEqual(json.loads(response.content), {
            "id": 1,
            "title": "Promenu ĉirkaŭ la lago",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": True,
            "registration_capacity": 12,
            "registration_deadline": "2022-03-15T15:20:24Z",
            "starting_time": "2022-03-16T15:20:34Z",
            "location": "T-Town"
        })


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
