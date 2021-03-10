"""Model serializers"""

from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth.admin import User
from datetime import datetime
import pytz
from .models import Activity, Profile, Category


class UserWithProfileSerializer(RegisterSerializer):
    """Custom serializer for account registration"""

    phone_number = serializers.CharField(max_length=11)
    is_organization = serializers.BooleanField(default=False)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['phone_number'] = self.validated_data.get('phone_number', '')
        data['is_organization'] = self.validated_data.get('is_organization', '')
        return data


class ActivitySerializer(serializers.ModelSerializer):
    """Modified Activity serializer that includes author's username"""

    username = serializers.CharField(source="user.username")

    def to_representation(self, instance):
        # Simplify response data
        representation = super().to_representation(instance)
        if not instance.has_registration:
            for field in ['registration_capacity', 'registration_deadline', 'starting_time', 'location']:
                representation.pop(field)
        return representation

    class Meta:
        model = Activity
        fields = '__all__'


class BasicActivitySerializer(serializers.ModelSerializer):
    """Activity serializer that excludes the user object"""

    def to_internal_value(self, data):
        # Validate incoming data
        internal = super().to_internal_value(data)
        if 'has_registration' in internal and internal['has_registration']:
            registration_fields = ['registration_capacity', 'registration_deadline', 'starting_time', 'location']
            errors = {field: [] for field in registration_fields}
            # Validate existence of registration fields
            for field in registration_fields:
                if field not in internal:
                    errors[field] += ["This field is required when has_registration is true"]
            # Validate time and date fields
            now = datetime.now(tz=pytz.UTC)
            for field in ['registration_deadline', 'starting_time']:
                # Validate that fields are in the future
                if field in internal and internal[field] < now:
                        errors[field] += ["Should not be in the past"]
            # Validate that deadline is before (or at) starting time
            if {'registration_deadline', 'starting_time'} <= internal.keys():
                if internal['registration_deadline'] > internal['starting_time']:
                    errors['registration_deadline'] += ["Deadline should not be after starting time"]
            # Report fields with errors
            errors = {k: v for (k, v) in errors.items() if len(v) > 0}
            if errors:
                raise serializers.ValidationError(errors)
        return internal

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
    is_organization = serializers.BooleanField(source="profile.is_organization",default=False)

    def update(self, instance, validated_data):
        instance.profile.__dict__.update(validated_data.pop('profile'))
        instance.profile.save()
        return super().update(instance, validated_data)

    class Meta:
        model = User
        fields = ("is_organization","phone_number", "username", "email")


class CategorySerializer(serializers.ModelSerializer):
    """Standard model serializer for Category"""

    class Meta:
        model = Category
        fields = "__all__"
