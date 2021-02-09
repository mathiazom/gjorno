from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ActivitySerializer
from .models import Activity


class ActivityView(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()
