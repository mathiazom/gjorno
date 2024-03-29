"""
Unit tests for models and related views
"""

from django.core.files import File
from django.test import TestCase
from django.contrib.auth.admin import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from rest_framework.utils import json

from .models import Activity, Registration, Category, Image, Profile, Log


class UserRegisterLoginTest(TestCase):
    """Testing user registration and login"""

    def setUp(self):
        self.client = APIClient()

    def assert_registration(self, response, username):
        # Check that something was created
        self.assertEqual(response.status_code, 201)
        # Check that token key is returned
        response_dict = json.loads(response.content)
        self.assertTrue('key' in response_dict)
        self.assert_token_response(response, username)

    def assert_token_response(self, response, username):
        response_dict = json.loads(response.content)
        # Check that user object is created with returned token
        self.assertTrue(User.objects.filter(username=username).exists())
        self.assertEqual(response_dict['key'], Token.objects.get(user=User.objects.get(username=username)).key)

    def test_register_user(self):
        """Request registration of regular user"""
        response = self.client.post('/auth/register/', {
            "username": "HeinrichSpiegel32",
            "email": "heinrich@spiegel.de",
            "password1": "FiiaWZP3SVL7Su7dGhk4BuMTqzsMMncc",
            "password2": "FiiaWZP3SVL7Su7dGhk4BuMTqzsMMncc"
        })
        self.assert_registration(response, "HeinrichSpiegel32")

    def test_register_organization(self):
        """Request registration of organization"""
        response = self.client.post('/auth/register/', {
            "username": "WilhelmFliegstad17",
            "email": "wilhelm@fliegstad.de",
            "password1": "8jSXhS2SHxcXEUXxyjN8ecU7saGUgW6p",
            "password2": "8jSXhS2SHxcXEUXxyjN8ecU7saGUgW6p",
            "is_organization": True
        })
        self.assert_registration(response, "WilhelmFliegstad17")

    def test_login_user(self):
        """Request user login (token retrieval)"""
        self.client.post('/auth/register/', {
            "username": "zamenhof59",
            "email": "zamenhof@epsilon.de",
            "password1": "4SX8cGdwgGQsyxDEp4CN3YzqFa2RLUju",
            "password2": "4SX8cGdwgGQsyxDEp4CN3YzqFa2RLUju"
        })
        response = self.client.post('/auth/login/', {
            "username": "zamenhof59",
            "password": "4SX8cGdwgGQsyxDEp4CN3YzqFa2RLUju"
        })
        self.assertEqual(response.status_code, 200)
        self.assert_token_response(response, "zamenhof59")


class ActivityBaseTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="zamenhof59")
        self.profile = Profile.objects.create(user=self.user, phone_number="+4712345678")
        self.user2 = User.objects.create(username="klara63")
        self.profile2 = Profile.objects.create(user=self.user2, phone_number="+4712344321")
        self.users = []
        for i in range(0, 3):
            user = User.objects.create(username=f"zamenhox{i}")
            self.profile = Profile.objects.create(user=user, phone_number="+4712345678")
            self.users.append(user)
        self.categories = [
            Category.objects.create(title=f"Test Category {i}") for i in range(3)
        ]
        token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.token2 = Token.objects.create(user=self.user2)
        self.client2 = APIClient()
        self.client2.credentials(HTTP_AUTHORIZATION='Token ' + self.token2.key)
        self.organization = User.objects.create(username="Espio Inc.")
        Profile.objects.create(user=self.organization, phone_number="+99987654321", is_organization=True)
        self.activity = Activity.objects.create(
            user=self.user, title="Promenu ĉirkaŭ la lago",
            ingress="Ruli hekto obl co, ho ido stif frota.",
            description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            price=500.0,
            activity_level=1
        )
        self.token_organization = Token.objects.create(user=self.organization)
        self.client_organization = APIClient()
        self.client_organization.credentials(HTTP_AUTHORIZATION='Token ' + self.token_organization.key)
        self.activity.categories.set([1, 3])
        self.activity_with_registration = Activity.objects.create(
            user=self.user, title="Promenu ĉirkaŭ la lago",
            ingress="Ruli hekto obl co, ho ido stif frota.",
            description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            has_registration=True,
            registration_capacity=12,
            registration_deadline="2022-03-17T15:20:24Z",
            starting_time="2022-03-23T15:20:34Z",
            location="Laguna Roponda",
            price=500.0,
            activity_level=1
        )
        self.activity_with_registration.categories.set([1, 3])
        self.activity_past_deadline = Activity.objects.create(
            user=self.user, title="Promenu ĉirkaŭ la lago",
            ingress="Ruli hekto obl co, ho ido stif frota.",
            description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            has_registration=True,
            registration_capacity=12,
            registration_deadline="2020-03-17T15:20:24Z",
            starting_time="2020-03-23T15:20:34Z",
            location="Laguna Roponda",
            price=500.0,
            activity_level=1
        )
        self.activity_past_deadline.categories.set([1, 3])
        self.activity_max_capacity = Activity.objects.create(
            user=self.user, title="Promenu ĉirkaŭ la lago",
            ingress="Ruli hekto obl co, ho ido stif frota.",
            description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            has_registration=True,
            registration_capacity=1,
            registration_deadline="2022-03-17T15:20:24Z",
            starting_time="2022-03-23T15:20:34Z",
            location="Laguna Roponda",
            price=500.0,
            activity_level=1
        )
        self.activity_max_capacity.categories.set([1, 3])
        Registration.objects.create(user=self.users[0], activity=self.activity_max_capacity)

        self.activities = []
        for i in range(1, 5):
            activity = Activity.objects.create(
                user=self.user, title=f"Promenu ĉirkaŭ la lago {i}",
                ingress="Ruli hekto obl co, ho ido stif frota.",
                description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            )
            activity.categories.set([1, 3])
            self.activities.append(activity)


class ActivityTest(ActivityBaseTest):
    """Testing activity model"""

    def test_activity_string(self):
        """Make sure string is correct"""
        self.activity = Activity.objects.create(
            user=self.user, title="Promenu ĉirkaŭ la lago", description=""
        )
        self.assertEqual(str(self.activity), "Promenu ĉirkaŭ la lago")

    def test_retrieve_activities(self):
        """Make sure created activities can be retrieved with correct fields"""
        # Request activity retrieval (without auth)
        client = APIClient()
        response = client.get('/api/activities/')
        # Check that each activity in json response matches original
        json_response = json.loads(response.content)
        for i, activity in enumerate(self.activities):
            self.assertDictEqual(
                json_response[3 - i],
                {
                    "id": activity.id,
                    "title": activity.title,
                    "ingress": "Ruli hekto obl co, ho ido stif frota.",
                    "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
                    "categories": [1, 3],
                    "image": None,
                    "user": self.user.id,
                    "username": "zamenhof59",
                    "is_organization": False,
                    "has_registration": False,
                    "is_author": False,
                    "is_favorited": False,
                    "is_registered": False,
                    "price": activity.price,
                    "activity_level": activity.activity_level
                }
            )

    def test_retrieve_activity_as_view(self):
        """Request activity retrieval (with view registration)"""
        response = self.client.get(f'/api/activities/{self.activity.id}/?register_view')
        self.assertEqual(response.status_code, 200)
        # Request activity retrieval without auth
        response = APIClient().get(f'/api/activities/{self.activity.id}/?register_view')
        self.assertEqual(response.status_code, 200)

    def test_retrieve_activities_with_registration(self):
        """Make sure created activities (with registration) can be retrieved with correct fields"""
        activities_with_registration = []
        for i in range(1, 5):
            activity = Activity.objects.create(
                user=self.user, title=f"Promenu ĉirkaŭ la lago {i}",
                ingress="Ruli hekto obl co, ho ido stif frota.",
                description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
                has_registration=True, registration_capacity=10, registration_deadline="2022-03-17T15:20:24+01:00",
                starting_time="2022-03-23T15:20:34+01:00", location="T-Town", price=None, activity_level=None
            )
            activity.categories.set([1, 3])
            activities_with_registration.append(activity)
        # Request activity retrieval
        client = APIClient()
        response = client.get('/api/activities/')
        # Check that each activity in json response matches original
        json_response = json.loads(response.content)
        for i, activity in enumerate(activities_with_registration):
            self.assertDictEqual(
                json_response[3 - i],
                {
                    "id": activity.id,
                    "title": activity.title,
                    "ingress": "Ruli hekto obl co, ho ido stif frota.",
                    "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
                    "categories": [1, 3],
                    "image": None,
                    "user": self.user.id,
                    "username": "zamenhof59",
                    "is_organization": False,
                    "has_registration": True,
                    "registration_capacity": 10,
                    "registration_deadline": "2022-03-17T15:20:24+01:00",
                    "starting_time": "2022-03-23T15:20:34+01:00",
                    "location": "T-Town",
                    "registrations_count": 0,
                    "is_author": False,
                    "is_favorited": False,
                    "is_registered": False,
                    "price": None,
                    "activity_level": None
                }
            )

    def test_post_activity(self):
        """Request creation of activity"""
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "ingress": "Ruli hekto obl co, ho ido stif frota.",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3]
        })
        # Check that activity was created successfully
        self.assertEqual(response.status_code, 201)
        self.assertDictEqual(json.loads(response.content), {
            "id": response.data['id'],
            "title": "Promenu ĉirkaŭ la lago",
            "ingress": "Ruli hekto obl co, ho ido stif frota.",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "image": None,
            "has_registration": False,
            "registration_capacity": None,
            "registration_deadline": None,
            "starting_time": None,
            "location": None,
            "price": None,
            "activity_level": None
        })

    def test_post_activity_with_gallery_image(self):
        with File(open("media/test/rr.jpg", "rb")) as test_image_file:
            # Pretend that file has a different path to make media folder a little tidier
            test_image_file.name = "test/rr.jpg"
            test_image = Image.objects.create(title="RR", image=test_image_file)
            response = self.client.post('/api/activities/', {
                "title": "Promenu ĉirkaŭ la lago",
                "ingress": "Ruli hekto obl co, ho ido stif frota.",
                "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
                "categories": [1, 3],
                "gallery_image": test_image.id,
            })
            # Check that activity was created successfully
            self.assertEqual(response.status_code, 201)
            self.assertDictEqual(json.loads(response.content), {
                "id": response.data['id'],
                "title": "Promenu ĉirkaŭ la lago",
                "ingress": "Ruli hekto obl co, ho ido stif frota.",
                "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
                "categories": [1, 3],
                "image": "http://testserver" + test_image.image.url,
                "has_registration": False,
                "registration_capacity": None,
                "registration_deadline": None,
                "starting_time": None,
                "location": None,
                "price": None,
                "activity_level": None
            })

    def test_post_activity_with_registration_missing_all_fields(self):
        """Request creation of activity with registration, but without fields"""
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "ingress": "Ruli hekto obl co, ho ido stif frota.",
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
        """Request creation of activity with registration, but without capacity field"""
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "ingress": "Ruli hekto obl co, ho ido stif frota.",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": True,
            "registration_deadline": "2022-03-17T15:20:24Z",
            "starting_time": "2022-03-23T15:20:34Z",
            "location": "T-Town"
        })
        # Check that creation failed
        self.assertEqual(response.status_code, 400)
        # Check that failed fields is the missing registration field
        self.assertDictEqual(
            json.loads(response.content),
            {
                "registration_capacity": ["This field is required when has_registration is true"]
            }
        )

    def test_post_activity_dates_in_past(self):
        """Request creation of activity with registration, but where dates are in the past"""
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "ingress": "Ruli hekto obl co, ho ido stif frota.",
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
        # Check that failed fields are the dates in the past
        self.assertDictEqual(
            json.loads(response.content),
            {
                k: ["Should not be in the past"]
                for k in ["registration_deadline", "starting_time"]
            }
        )

    def test_post_activity_deadline_after_start(self):
        """Request creation of activity with registration, but where the activity starts before deadline"""
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "ingress": "Ruli hekto obl co, ho ido stif frota.",
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
        # Check that failed field is deadline
        self.assertDictEqual(
            json.loads(response.content),
            {
                "registration_deadline": ["Deadline should not be after starting time"]
            }
        )

    def test_post_activity_with_registration(self):
        """Request creation of activity with registration, with all fields valid"""
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "ingress": "Ruli hekto obl co, ho ido stif frota.",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": True,
            "registration_capacity": 12,
            "registration_deadline": "2022-03-15T15:20:24+01:00",
            "starting_time": "2022-03-16T15:20:34+01:00",
            "location": "T-Town"
        })
        # Check that creation was successful
        self.assertEqual(response.status_code, 201)
        # Check resulting activity
        self.assertDictEqual(json.loads(response.content), {
            "id": response.data['id'],
            "title": "Promenu ĉirkaŭ la lago",
            "ingress": "Ruli hekto obl co, ho ido stif frota.",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "image": None,
            "has_registration": True,
            "registration_capacity": 12,
            "registration_deadline": "2022-03-15T15:20:24+01:00",
            "starting_time": "2022-03-16T15:20:34+01:00",
            "location": "T-Town",
            "price": None,
            "activity_level": None
        })

    def test_post_activity_without_registration_but_with_fields(self):
        """Request creation of activity without registration, but with registration fields"""
        response = self.client.post('/api/activities/', {
            "title": "Promenu ĉirkaŭ la lago",
            "ingress": "Ruli hekto obl co, ho ido stif frota.",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": False,
            "registration_capacity": 12,
            "registration_deadline": "2022-03-15T15:20:24Z",
            "starting_time": "2022-03-16T15:20:34Z",
            "location": "T-Town",
            "price": 500.0,
            "activity_level": 1
        })
        # Check that creation was successful
        self.assertEqual(response.status_code, 201)
        # Check that registration fields are ignored
        activity_id = response.data['id']
        self.assertDictEqual(json.loads(self.client.get(f"/api/activities/{activity_id}/").content), {
            "id": activity_id,
            "user": self.user.id,
            "username": self.user.username,
            "is_organization": False,
            "title": "Promenu ĉirkaŭ la lago",
            "ingress": "Ruli hekto obl co, ho ido stif frota.",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "image": None,
            "has_registration": False,
            "is_author": True,
            "is_favorited": False,
            "is_registered": False,
            "price": 500.0,
            "activity_level": 1
        })

    def put_activity(self):
        return self.client.put(f'/api/activities/{self.activity.id}/', {
            "user": self.user,
            "title": "Ruli hekto obl co",
            "ingress": "Ho ido stif frota.",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3]
        })

    def test_put_activity(self):
        """Request to change activity details, following all constraints"""
        response = self.put_activity()
        # Check that update was successful
        self.assertEqual(response.status_code, 200)

    def test_put_activity_with_registration(self):
        """Request to change activity (with registration) details, following all constraints"""
        self.register_users()
        response = self.client.put(f'/api/activities/{self.activity_with_registration.id}/', {
            "user": self.user,
            "title": "Ruli hekto obl co",
            "ingress": "Ho ido stif frota.",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": "true",
            "registration_capacity": len(self.users) + 1,
            "registration_deadline": "2022-03-17T15:20:24Z",
            "starting_time": "2023-03-23T15:20:34Z",
            "location": "Laguna Reponda"
        })
        # Check that update was successful
        self.assertEqual(response.status_code, 200)

    def test_put_activity_not_author(self):
        """Request to change activity details, with incorrect user"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token2.key}')
        response = self.put_activity()
        # Check that update was denied
        self.assertEqual(response.status_code, 403)

    def register_users(self):
        """Register dummy users to activity with registration"""
        for user in self.users:
            Registration.objects.create(
                activity=self.activity_with_registration,
                user=user
            )

    def test_put_activity_decrease_capacity_below_count(self):
        """
        Request capacity change to value below current number of registrations
        This should be denied, since it would require deletion of registrations
        """
        self.register_users()
        response = self.client.put(f'/api/activities/{self.activity_with_registration.id}/', {
            "user": self.user,
            "title": "Promenu ĉirkaŭ la lago",
            "ingress": "Ruli hekto obl co, ho ido stif frota.",
            "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            "categories": [1, 3],
            "has_registration": "true",
            "registration_capacity": len(self.users) - 1,
            "registration_deadline": "2022-03-17T15:20:24Z",
            "starting_time": "2022-03-23T15:20:34Z",
            "location": "Laguna Roponda"
        })
        # Check that update was denied
        self.assertEqual(response.status_code, 403)

    def test_delete_activity_as_author(self):
        """Request activity deletion (auth as author)"""
        response = self.client.delete(f"/api/activities/{self.activity.id}/")
        self.assertEqual(response.status_code, 204)

    def test_delete_activity_wrong_user(self):
        """Request activity deletion (no auth)"""
        response = self.client2.delete(f"/api/activities/{self.activity.id}/")
        self.assertEqual(response.status_code, 403)

    def test_delete_activity_no_auth(self):
        """Request activity deletion (no auth)"""
        response = APIClient().delete(f"/api/activities/{self.activity.id}/")
        self.assertEqual(response.status_code, 401)


class ActivityRegistrationsTest(ActivityBaseTest):

    def test_retrieve_registrations(self):
        """Request registrations retrieval (as author)"""
        response = self.client.get(f'/api/activities/{self.activity_with_registration.id}/participants/')
        # Check that request was accepted
        self.assertEqual(response.status_code, 200)

    def test_retrieve_registrations_no_registration(self):
        """Request registrations of activity that has no registration"""
        response = self.client.get(f'/api/activities/{self.activity.id}/participants/')
        # Check that request was accepted
        self.assertEqual(response.status_code, 200)
        # Make sure response list is empty
        self.assertListEqual(json.loads(response.content), [])

    def test_retrieve_registrations_unauthorized(self):
        """Request registrations retrieval (without auth)"""
        client = APIClient()
        response = client.get(f'/api/activities/{self.activity.id}/participants/')
        # Check that request was denied
        self.assertEqual(response.status_code, 401)

    def test_retrieve_registrations_not_author(self):
        """Request registrations retrieval (different user than author)"""
        response = self.client2.get(f'/api/activities/{self.activity.id}/participants/')
        # Check that request was denied
        self.assertEqual(response.status_code, 403)

    def register_user(self):
        return self.client2.post(f'/api/activities/{self.activity_with_registration.id}/register/')

    def test_register_user(self):
        """Request registration of user to activity"""
        response = self.register_user()
        # Check that request was accepted
        self.assertEqual(response.status_code, 200)

    def test_register_author(self):
        """Request registration of author to activity"""
        response = self.client.post(f'/api/activities/{self.activity_with_registration.id}/register/')
        self.assertEqual(response.status_code, 403)

    def test_register_after_deadline(self):
        """Request registration after deadline"""
        response = self.client2.post(f'/api/activities/{self.activity_past_deadline.id}/register/')
        self.assertEqual(response.status_code, 403)

    def test_register_user_is_organization(self):
        """Request registration of an organization"""
        response = self.client_organization.post(f'/api/activities/{self.activity_with_registration.id}/register/')
        # Check that request was denied
        self.assertEqual(response.status_code, 403)

    def test_register_registered_user(self):
        """Request registration of already registered user"""
        self.register_user()
        response = self.register_user()
        # Check that request was denied
        self.assertEqual(response.status_code, 403)

    def test_register_beyond_capacity(self):
        """Request registration of user after capacity has been reached"""
        response = self.client2.post(f'/api/activities/{self.activity_max_capacity.id}/register/')
        # Check that request was denied
        self.assertEqual(response.status_code, 403)

    def test_unregister_user(self):
        """Request removal of user registration to activity"""
        self.register_user()
        response = self.client2.post(f'/api/activities/{self.activity_with_registration.id}/unregister/')
        # Check that request was accepted
        self.assertEqual(response.status_code, 200)

    def test_unregister_unregistered_user(self):
        """Request removal of non-existent activity registration of user"""
        response = self.client.post(f'/api/activities/{self.activity_with_registration.id}/unregister/')
        # Check that request was denied
        self.assertEqual(response.status_code, 403)

    def test_register_user_no_registration(self):
        """Request registration of user to an activity without registration"""
        response = self.client.post(f'/api/activities/{self.activity.id}/register/')
        # Check that request was denied
        self.assertEqual(response.status_code, 403)

    def test_retrieve_registered_activities(self):
        """Request activities where logged in user is registered"""
        activities_with_registration = []
        for i in range(1, 5):
            activity = Activity.objects.create(
                user=self.user, title=f"Promenu ĉirkaŭ la lago {i}",
                ingress="Ruli hekto obl co, ho ido stif frota.",
                description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
                has_registration=True, registration_capacity=10, registration_deadline="2022-03-17T15:20:24+01:00",
                starting_time="2022-03-23T15:20:34+01:00", location="T-Town", price=None, activity_level=None
            )
            activity.categories.set([1, 3])
            activities_with_registration.append(activity)
        self.client2.post(f'/api/activities/{activities_with_registration[0].id}/register/')
        self.client2.post(f'/api/activities/{activities_with_registration[1].id}/register/')
        response = self.client2.get("/api/my_registered_activities/")
        json_response = json.loads(response.content)
        for i, activity in enumerate(activities_with_registration[0:2]):
            self.assertDictEqual(
                json_response[1 - i],
                {
                    "id": activity.id,
                    "title": activity.title,
                    "ingress": "Ruli hekto obl co, ho ido stif frota.",
                    "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
                    "categories": [1, 3],
                    "image": None,
                    "user": self.user.id,
                    "username": "zamenhof59",
                    "is_organization": False,
                    "has_registration": True,
                    "registration_capacity": 10,
                    "registration_deadline": "2022-03-17T15:20:24+01:00",
                    "starting_time": "2022-03-23T15:20:34+01:00",
                    "location": "T-Town",
                    "registrations_count": 1,
                    "price": None,
                    "activity_level": None
                }
            )


class ActivityFavoriteTest(ActivityBaseTest):

    def test_favorite_activity(self):
        """Request favorite activity as logged in user"""
        response = self.client.post(f'/api/activities/{self.activity.id}/favorite/')
        self.assertEqual(response.status_code, 201)

    def test_favorite_activity_twice(self):
        """Request favorite activity when already favorited"""
        self.client.post(f'/api/activities/{self.activity.id}/favorite/')
        response = self.client.post(f'/api/activities/{self.activity.id}/favorite/')
        self.assertEqual(response.status_code, 403)

    def test_unfavorite_activity(self):
        """Request unfavorite activity as logged in user"""
        self.client.post(f'/api/activities/{self.activity.id}/favorite/')
        response = self.client.post(f'/api/activities/{self.activity.id}/unfavorite/')
        self.assertEqual(response.status_code, 200)

    def test_unfavorite_not_favorited_activity(self):
        """Request unfavorite activity not favorited by logged in user"""
        response = self.client.post(f'/api/activities/{self.activity.id}/unfavorite/')
        self.assertEqual(response.status_code, 403)

    def test_retrieve_favorited_activities(self):
        """Request activities logged in user has favorited"""
        self.client.post(f'/api/activities/{self.activities[0].id}/favorite/')
        self.client.post(f'/api/activities/{self.activities[1].id}/favorite/')
        response = self.client.get("/api/my_favorite_activities/")
        json_response = json.loads(response.content)
        for i, activity in enumerate(self.activities[0:2]):
            self.assertDictEqual(
                json_response[i],
                {
                    "id": activity.id,
                    "title": activity.title,
                    "ingress": "Ruli hekto obl co, ho ido stif frota.",
                    "description": "Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
                    "categories": [1, 3],
                    "image": None,
                    "user": self.user.id,
                    "username": "zamenhof59",
                    "is_organization": False,
                    "has_registration": False,
                    "price": activity.price,
                    "activity_level": activity.activity_level
                }
            )


class MyActivitiesTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="zamenhof59")
        self.profile = Profile.objects.create(user=self.user, phone_number="+4712345678")
        token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.user2 = User.objects.create(username="klara63")
        self.categories = [
            Category.objects.create(title=f"Test Category {i}") for i in range(3)
        ]
        self.activity1 = Activity.objects.create(
            user=self.user, title="Promenu ĉirkaŭ la lago",
            ingress="Ruli hekto obl co, ho ido stif frota.",
            description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota."
        )
        self.activity1.categories.set([1, 3])
        self.activity2 = Activity.objects.create(
            user=self.user2, title="Promenu ĉirkaŭ la lago",
            ingress="Ruli hekto obl co, ho ido stif frota.",
            description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota."
        )
        self.activity2.categories.set([2])

    def test_retrieve_my_activities(self):
        """Request list of activities created by authorized user"""
        response = self.client.get('/api/my_activities/')
        self.assertEqual(response.status_code, 200)
        # Check that each activity in json response matches original
        json_response = json.loads(response.content)
        self.assertListEqual(
            json_response,
            [
                {
                    "id": self.activity1.id,
                    "title": self.activity1.title,
                    "ingress": self.activity1.ingress,
                    "description": self.activity1.description,
                    "categories": [1, 3],
                    "image": None,
                    "user": self.user.id,
                    "username": "zamenhof59",
                    "is_organization": False,
                    "has_registration": False,
                    "price": self.activity1.price,
                    "activity_level": self.activity1.activity_level
                }
            ]
        )


class LogTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="zamenhof59")
        self.user2 = User.objects.create(username="klara63")
        self.profile2 = Profile.objects.create(user=self.user2, is_organization=False)
        token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        token2 = Token.objects.create(user=self.user2)
        self.client2 = APIClient()
        self.client2.credentials(HTTP_AUTHORIZATION='Token ' + token2.key)
        self.activity = Activity.objects.create(
            user=self.user2, title="Promenu ĉirkaŭ la lago",
            ingress="Ruli hekto obl co, ho ido stif frota.",
            description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota.",
            has_registration=False,
            activity_level=2
        )
        self.activity2 = Activity.objects.create(
            user=self.user2, title="Promenu ĉirkaŭ la lago 2",
            ingress="Ruli hekto obl co, ho ido stif frota 2.",
            description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota. 2",
            has_registration=False,
            activity_level=1
        )
        self.activity3 = Activity.objects.create(
            user=self.user2, title="Promenu ĉirkaŭ la lago 3",
            ingress="Ruli hekto obl co, ho ido stif frota 3.",
            description="Apud ferio substantivo hu ial. Ruli hekto obl co, ho ido stif frota. 3",
            has_registration=False,
            activity_level=3
        )

    def test_post_log(self):
        """Request logging av activity completion"""
        response = self.client.post(f"/api/activities/{self.activity.id}/log/")
        self.assertEqual(response.status_code, 201)

    def test_delete_log(self):
        """Request removal of activity log"""
        self.log = Log.objects.create(user=self.user, activity=self.activity)
        response = self.client.delete(f"/api/my_logs/{self.log.id}/")
        self.assertEqual(response.status_code, 204)

    def test_retrieve_logged_activities(self):
        """Request logged in user's logged activities"""
        self.log1 = Log.objects.create(user=self.user, activity=self.activity)
        self.log2 = Log.objects.create(user=self.user, activity=self.activity)
        response = self.client.get("/api/my_logs/")
        json_response = json.loads(response.content)
        self.assertListEqual(
            json_response,
            [
                {
                    "log_id": self.log1.id,
                    "log_timestamp": json_response[0]['log_timestamp'],
                    "activity": self.activity.id,
                    "title": self.activity.title,
                    "ingress": self.activity.ingress,
                    "description": self.activity.description,
                    "categories": [],
                    "image": None,
                    "price": None,
                    "user": self.user2.id,
                    "username": self.user2.username,
                    "is_organization": False,
                    "has_registration": False,
                    "activity_level": self.activity.activity_level
                },
                {
                    "log_id": self.log2.id,
                    "log_timestamp": json_response[1]['log_timestamp'],
                    "activity": self.activity.id,
                    "title": self.activity.title,
                    "ingress": self.activity.ingress,
                    "description": self.activity.description,
                    "categories": [],
                    "image": None,
                    "price": None,
                    "user": self.user2.id,
                    "username": self.user2.username,
                    "is_organization": False,
                    "has_registration": False,
                    "activity_level": self.activity.activity_level
                }
            ]
        )


class CategoryTest(TestCase):
    """Testing category model"""

    def setUp(self):
        self.category = Category.objects.create(title="Atletiko")

    def test_category_string(self):
        """Make sure string is correct"""
        self.assertEqual(str(self.category), "Atletiko")


class UserProfileTest(TestCase):
    """Testing user and profile model"""

    def setUp(self):
        self.user = User.objects.create(
            first_name="Ludwig", last_name="Zamenhof",
            username="zamenhof59", email="ludwig@zamenhof.eo"
        )
        token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.profile = Profile.objects.create(
            user=self.user, phone_number="+4283356789"
        )

    def test_profile_string(self):
        """Make sure string is correct"""
        self.assertEqual(str(self.profile), "zamenhof59")

    def test_retrieve_current_user(self):
        """Request data about currently logged in user"""
        response = self.client.get('/api/current_user/')
        self.assertEqual(response.status_code, 200)
        json_response = json.loads(response.content)
        self.assertDictEqual(json_response, {
            "username": self.user.username,
            "email": self.user.email,
            "phone_number": "+4283356789",
            "is_organization": False,
            "avatar": None
        })

    def test_update_profile(self):
        """Request update of profile info"""
        response = self.client.put('/api/current_user/', {
            "username": "klara63",
            "email": "klara@post.fm",
            "phone_number": "+4712344321",
            "avatar": ""
        })
        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(json.loads(response.content), {
            "username": "klara63",
            "email": "klara@post.fm",
            "phone_number": "+4712344321",
            "is_organization": False,
            "avatar": None
        })
