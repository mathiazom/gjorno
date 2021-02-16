"""Model serializers"""

from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields = '__all__'

class BasicActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        exclude = ('user',)