"""Model serializers"""

from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth.admin import User
from .models import Activity, Profile, Category


class UserWithProfileSerializer(RegisterSerializer):
    """Custom serializer for account registration"""

    phone_number = serializers.CharField(max_length=11)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['phone_number'] = self.validated_data.get('phone_number', '')
        return data


class ActivitySerializer(serializers.ModelSerializer):
    """Modified Activity serializer that includes author's username"""

    username = serializers.CharField(source="user.username")

    class Meta:
        model = Activity
        fields = '__all__'


class BasicActivitySerializer(serializers.ModelSerializer):
    """Activity serializer that excludes the user object"""

    class Meta:
        model = Activity
        exclude = ('user',)


class ProfileSerializer(serializers.ModelSerializer):
    """Standard model serializer for Profile"""
    class Meta:
        model = Profile
        fields = '__all__'


class UserAndProfileSerializer(serializers.ModelSerializer):
    """Serializer for combining user and profile information"""

    phone_number = serializers.CharField(source="profile.phone_number", max_length=11)

    def update(self, instance, validated_data):
        instance.profile.__dict__.update(validated_data.pop('profile'))
        instance.profile.save()
        return super().update(instance, validated_data)

    class Meta:
        model = User
        fields = ("phone_number", "username", "email")


class CategorySerializer(serializers.ModelSerializer):
    """Standard model serializer for Category"""
    class Meta:
        model = Category
        fields = "__all__"
