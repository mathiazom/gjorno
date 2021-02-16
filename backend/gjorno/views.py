'''
This is views
'''


from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import ActivitySerializer, BasicActivitySerializer
from .models import Activity


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
