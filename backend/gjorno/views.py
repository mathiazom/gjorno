'''
This is views
'''


from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import ActivitySerializer, BasicActivitySerializer, UserAndProfileSerializer
from .models import Activity
from rest_framework.permissions import IsAuthenticated



class ActivityView(viewsets.ModelViewSet):
    """View for the set of all Activity objects"""
    queryset = Activity.objects.all()

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

class UsersView(viewsets.ModelViewSet):
    """View for the user information"""
    queryset = User.objects.all()
    serializer_class = UserAndProfileSerializer

class MyActivitiesView(viewsets.ReadOnlyModelViewSet):
    """ View for the set of all of the users.. """
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user)
