"""
This is views
"""

from django.contrib.auth.admin import User
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .serializers import \
    ActivitySerializer, \
    BasicActivitySerializer, \
    UserAndProfileSerializer, \
    CategorySerializer, RegistrationSerializer
from .models import Activity, Category, Registration
from datetime import datetime
import pytz


class ActivitiesView(viewsets.ModelViewSet):
    """View for the set of all Activity objects"""

    # Only allow retrieval when not logged in
    permission_classes = [IsAuthenticatedOrReadOnly]

    # All activities, ordered by creation time (aka descending id)
    queryset = Activity.objects.all().order_by('-id')

    def get_serializer_class(self):
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return BasicActivitySerializer
        return ActivitySerializer

    
    @staticmethod
    def append_user_specific_fields(data, request):
        # Flag to determine if activity was authored by authorized user
        data['is_author'] = request.user.id == data['user']
        # Flag to determine if user is registered to activity
        data['is_registered'] = Registration.objects.filter(user = request.user.id, activity=data['id']).exists()



    # Append extra fields when retrieving activity
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, args, kwargs)
        self.append_user_specific_fields(response.data, request)
        return response

    # Append extra fields when retrieving activities
    def list(self, request, *args, **kwargs):
        response = super().list(request, args, kwargs)
        for activity in response.data:
            self.append_user_specific_fields(activity, request)
        return response

    # Restrict activity edit to author only
    def update(self, request, *args, **kwargs):
        activity = Activity.objects.get(id=kwargs['pk'])
        if activity.user.id != self.request.user.id:
            return Response("User is not activity author", status=status.HTTP_403_FORBIDDEN)
        # If activity has registration, make sure capacity change is not removing registrations
        has_registration = activity.has_registration
        if 'has_registration' in request.data:
            # Request changes has_registration
            has_registration = request.data['has_registration']
        if has_registration:
            if int(request.data['registration_capacity']) < activity.registrations_count():
                return Response("Cannot decrease capacity below current number of registrations",
                                status=status.HTTP_403_FORBIDDEN)
        return super().update(request, args, kwargs)

    # Append user object to new activity
    def create(self, request, *args, **kwargs):
        activity = Activity(user=self.request.user)
        serializer = self.get_serializer(activity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistrationsView(viewsets.ReadOnlyModelViewSet):
    """View for the registrations of a given activity"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserAndProfileSerializer
    lookup_field = 'activity'

    def list(self, request, *args, **kwargs):
        # Only allow activity author to see registrations
        activity = Activity.objects.get(id=self.kwargs['activity'])
        if activity.user.id != self.request.user.id:
            return Response("Only activity author can view registered users", status=status.HTTP_403_FORBIDDEN)
        return super().list(request, args, kwargs)

    def get_queryset(self):
        activity = Activity.objects.get(id=self.kwargs['activity'])
        return activity.registered_users()


class ActivityRegisterView(generics.CreateAPIView):
    """View for registering user to activity"""
    permission_classes = [IsAuthenticated]
    serializer_class = RegistrationSerializer
    lookup_field = 'activity'

    def create(self, request, *args, **kwargs):
        user = self.request.user
        activity = Activity.objects.get(id=self.kwargs['activity'])
        if not activity.has_registration:
            return Response("Activity does not allow registration", status=status.HTTP_403_FORBIDDEN)
        if user.profile.is_organization:
            return Response("Registration of an organization is not allowed", status=status.HTTP_403_FORBIDDEN)
        if user.id == activity.user.id:
            return Response("Registration of the activity author is not allowed", status=status.HTTP_403_FORBIDDEN)
        if Registration.objects.filter(user=user.id, activity=activity.id):
            return Response("User is already registered to this activity", status=status.HTTP_403_FORBIDDEN)
        if activity.registration_deadline < datetime.now(tz=pytz.UTC):
            return Response("Can not register to activity after the deadline", status=status.HTTP_403_FORBIDDEN)
        if activity.registrations_count() >= activity.registration_capacity:
            return Response("Registration capacity is already reached", status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data={
            "user": user.id,
            "activity": activity.id
        })
        if serializer.is_valid():
            serializer.save()
            return Response("User was successfully registered", status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivityUnregisterView(generics.CreateAPIView):
    """View for unregistering user from activity"""
    permission_classes = [IsAuthenticated]
    serializer_class = RegistrationSerializer
    lookup_field = 'activity'

    def create(self, request, *args, **kwargs):
        user = self.request.user.id
        activity = self.kwargs['activity']
        registration = Registration.objects.filter(user=user, activity=activity)
        if not registration:
            return Response("User is not registered to this activity", status=status.HTTP_403_FORBIDDEN)
        registration.delete()
        return Response("User was successfully unregistered", status=status.HTTP_200_OK)


class UsersView(viewsets.ReadOnlyModelViewSet):
    """View for the user information"""
    queryset = User.objects.all()
    serializer_class = UserAndProfileSerializer


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """View for current user information"""
    serializer_class = UserAndProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return User.objects.get(id=self.request.user.id)


class MyActivitiesView(viewsets.ReadOnlyModelViewSet):
    """ View for the set of all of the users.. """
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user).order_by('-id')

class MyRegisteredActivitiesView(viewsets.ReadOnlyModelViewSet):
    """ View for the set of all of the users registered activities """
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        activity_ids = Registration.objects.filter(user=self.request.user.id).values_list('activity')
        return Activity.objects.filter(id__in=activity_ids).order_by('-id')


class CategoriesView(viewsets.ReadOnlyModelViewSet):
    """ View for the set of all categories. """
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
