"""
This is views
"""

from django.contrib.auth.admin import User
from rest_framework import viewsets, status, generics, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
import json
from .serializers import \
    ActivitySerializer, \
    BasicActivitySerializer, \
    UserAndProfileSerializer, \
    CategorySerializer, \
    ImageSerializer, \
    RegistrationSerializer, \
    FavoriteSerializer, \
    LogSerializer
from .models import Activity, Category, Registration, Image, Favorite, Log
from datetime import datetime
import pytz
from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework.views import APIView


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
        data['is_registered'] = Registration.objects.filter(user=request.user.id, activity=data['id']).exists()
        # Flag to determine if user favorited activity
        data['is_favorited'] = Favorite.objects.filter(user=request.user.id, activity=data['id']).exists()

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, args, kwargs)
        # Check if request should be treated as user viewing an activity
        if "register_view" in request.GET:
            # Register unique activity view if logged in (add will not duplicate)
            if request.user is not None and request.user.is_authenticated:
                self.get_object().users_viewed.add(request.user)
        # Append extra fields when retrieving activity
        self.append_user_specific_fields(response.data, request)
        return response

    # Append extra fields when retrieving activities
    def list(self, request, *args, **kwargs):
        response = super().list(request, args, kwargs)
        for activity in response.data:
            self.append_user_specific_fields(activity, request)
        return response

    def update(self, request, *args, **kwargs):
        activity = self.get_object()
        # Restrict activity edit to author only
        if activity.user.id != self.request.user.id:
            return Response("User is not activity author", status=status.HTTP_403_FORBIDDEN)
        has_registration = activity.has_registration
        # Make sure has_registration is not changed
        request_has_registration = request.data['has_registration']
        if isinstance(request_has_registration, str):
            # Parse boolean string
            request_has_registration = json.loads(request_has_registration)
        if 'has_registration' in request.data and has_registration != request_has_registration:
            return Response("Change of has_registration is not allowed", status=status.HTTP_403_FORBIDDEN)
        # If activity has registration, make sure capacity change is not removing registrations
        if has_registration:
            if int(request.data['registration_capacity']) < activity.registrations_count():
                return Response("Cannot decrease capacity below current number of registrations",
                                status=status.HTTP_403_FORBIDDEN)
        return super().update(request, args, kwargs)

    # Restrict activity deletion to author only
    def destroy(self, request, *args, **kwargs):
        if self.get_object().user.id != self.request.user.id:
            return Response("User is not activity author", status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, args, kwargs)

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


class ActivityFavoriteView(generics.CreateAPIView):
    """View for user favoriting activity"""
    permission_classes = [IsAuthenticated]
    serializer_class = FavoriteSerializer
    lookup_field = 'activity'

    def create(self, request, *args, **kwargs):
        user = self.request.user
        activity = Activity.objects.get(id=self.kwargs['activity'])

        if Favorite.objects.filter(user=user.id, activity=activity.id):
            return Response("User already favorited this activity", status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data={
            "user": user.id,
            "activity": activity.id
        })
        if serializer.is_valid():
            serializer.save()
            return Response("Activity successfully favorited", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivityUnfavoriteView(generics.CreateAPIView):
    """View for user unfavoriting activity"""
    permission_classes = [IsAuthenticated]
    serializer_class = FavoriteSerializer
    lookup_field = 'activity'

    def create(self, request, *args, **kwargs):
        user = self.request.user.id
        activity = self.kwargs['activity']
        favorite = Favorite.objects.filter(user=user, activity=activity)
        if not favorite:
            return Response("User has not favorited this activity", status=status.HTTP_403_FORBIDDEN)
        favorite.delete()
        return Response("Activity successfully unfavorited", status=status.HTTP_200_OK)


class ActivityLogView(generics.CreateAPIView):
    """View for user logging activity"""
    permission_classes = [IsAuthenticated]
    serializer_class = LogSerializer
    lookup_field = 'activity'

    def create(self, request, *args, **kwargs):
        user = self.request.user
        activity = Activity.objects.get(id=self.kwargs['activity'])
        serializer = self.get_serializer(data={
            "user": user.id,
            "activity": activity.id
        })
        if serializer.is_valid():
            serializer.save()
            return Response("Activity successfully logged", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivityUnlogView(viewsets.GenericViewSet, mixins.DestroyModelMixin):
    """View for user unlogging activity"""
    permission_classes = [IsAuthenticated]
    serializer_class = LogSerializer
    queryset = Log.objects.all()

    def destroy(self, request, *args, **kwargs):
        if self.get_object().user.id != self.request.user.id:
            return Response("User is not log author", status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, args, kwargs)


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
        return self.request.user.created_activities.order_by('-id')


class MyRegisteredActivitiesView(viewsets.ReadOnlyModelViewSet):
    """ View for the set of all of the users registered activities """
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        activity_ids = self.request.user.registrations.values_list('activity')
        return Activity.objects.filter(id__in=activity_ids).order_by('-id')


class MyFavoritedActivitiesView(viewsets.ReadOnlyModelViewSet):
    """ View for the set of all of the users favorited activities """
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        activity_ids = self.request.user.favorites.values_list('activity').order_by('-timestamp')
        return Activity.objects.filter(id__in=activity_ids)


class MyLoggedActivitiesView(viewsets.ReadOnlyModelViewSet):
    """ View for the set of all of the users logged activities """
    serializer_class = LogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.logs


class CategoriesView(viewsets.ReadOnlyModelViewSet):
    """ View for the set of all categories. """
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class ImagesView(viewsets.ReadOnlyModelViewSet):
    """ View for the set of all predefined images. """
    serializer_class = ImageSerializer
    queryset = Image.objects.all()


class ActivityContactView(APIView):
    """ View for sending mail. """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = User.objects.get(id=self.request.user.id)
        activity = Activity.objects.get(id=self.kwargs['activity'])

        if not user.email:
            return Response("User has not registered an email address", status=status.HTTP_403_FORBIDDEN)

        author = activity.user
        if not author.email:
            return Response("Author of this activity has not registered an email address",
                            status=status.HTTP_403_FORBIDDEN)

        errors = {}

        title = self.request.data.get('title')
        if not title:
            errors['title'] = "This field is required."

        message = self.request.data.get('message')
        if not message:
            errors['message'] = "This field is required."

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        sign = '\n\n\nMed vennlig hilsen\nGjørNo\nhttps://gjorno.site'

        email_verification_subject = 'GjørNo - Meldingen er sendt'
        email_verification_body = \
            f'Hei, {user.username}' \
            + f'\n\nMeldingen din har blitt sendt til {author.username}! De tar kontakt med deg direkte på e-post.' \
            + "\n\nDu skrev følgende:" \
            + "\n\n--------------------------------" \
            + f"\n{title}" \
            + f"\n\n{message}" \
            + "\n--------------------------------" \
            + sign

        email_contact_subject = title
        email_contact_body = \
            f"Hei, {author.username}" \
            + f"\n\nMelding fra {user.username} angående \"{activity.title}\":" \
            + "\n\n--------------------------------" \
            + f"\n{title}\n\n" \
            + self.request.data.get("message") \
            + "\n--------------------------------" \
            + "\n\nSend svar til: " + user.email \
            + sign

        confirm_email = EmailMessage(
            email_verification_subject,
            email_verification_body,
            settings.EMAIL_HOST_USER,
            [user.email]
        )

        contact_email = EmailMessage(
            email_contact_subject,
            email_contact_body,
            settings.EMAIL_HOST_USER,
            [author.email]
        )

        confirm_email.fail_silently = True
        contact_email.fail_silently = True
        confirm_email.send()
        contact_email.send()
        return Response("Email sent!", status=status.HTTP_200_OK)
