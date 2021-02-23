'''
This is views
'''

from django.contrib.auth.admin import User
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import\
    ActivitySerializer,\
    BasicActivitySerializer,\
    UserAndProfileSerializer, \
    CategorySerializer
from .models import Activity, Category


class ActivitiesView(viewsets.ModelViewSet):
    """View for the set of all Activity objects"""

    # All activities, ordered by creation time (aka descending id)
    queryset = Activity.objects.all().order_by('-id')

    def get_serializer_class(self):
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return BasicActivitySerializer
        return ActivitySerializer

    def create(self, request, *args, **kwargs):
        activity = Activity(user=self.request.user)
        serializer = self.get_serializer(activity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class CategoriesView(viewsets.ReadOnlyModelViewSet):
    """ View for the set of all categories. """
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
