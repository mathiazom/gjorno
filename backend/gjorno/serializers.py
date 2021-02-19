"""Model serializers"""

from rest_framework import fields, serializers
from rest_auth.registration.serializers import RegisterSerializer
from .models import Activity
from django.contrib.auth.admin import User


class UserWithProfileSerializer(RegisterSerializer):
    phone_number = serializers.CharField(max_length=11)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['phone_number'] = self.validated_data.get('phone_number', '')
        return data


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class BasicActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        exclude = ('user',)

class UserAndProfileSerializer(serializers.ModelSerializer):
    """This is the serializer for user and profile information"""


    phone_number = serializers.CharField(source="profile.phone_number")
    class Meta:
        model = User
        fields = ("phone_number", "username", "email")
    