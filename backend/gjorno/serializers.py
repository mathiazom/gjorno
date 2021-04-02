"""Model serializers"""

from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth.admin import User
from datetime import datetime
import pytz
from .models import Activity, Profile, Category, Registration, Image, Favorite, Log


class UserWithProfileSerializer(RegisterSerializer):
    """Custom serializer for account registration"""

    phone_number = serializers.CharField(max_length=11, required=False)
    is_organization = serializers.BooleanField(default=False)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['phone_number'] = self.validated_data.get('phone_number', '')
        data['is_organization'] = self.validated_data.get('is_organization', '')
        return data


class ActivitySerializer(serializers.ModelSerializer):
    """Modified Activity serializer that includes author's username"""

    username = serializers.CharField(source="user.username")
    is_organization = serializers.BooleanField(source="user.profile.is_organization")

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Add or remove registration data
        if instance.has_registration:
            representation['registrations_count'] = instance.registrations_count()
        else:
            for field in ['registration_capacity', 'registration_deadline', 'starting_time', 'location']:
                representation.pop(field)

        return representation

    class Meta:
        model = Activity
        exclude = ('users_viewed',)


class BasicActivitySerializer(serializers.ModelSerializer):
    """Activity serializer that excludes the user object"""

    def to_internal_value(self, data):
        internal = super().to_internal_value(data)

        # Replace possible gallery image id with actual image file
        if 'gallery_image' in data:
            internal['image'] = Image.objects.get(id=data['gallery_image']).image

        # Validate registration fields
        self.validate_registration(internal)

        return internal

    @staticmethod
    def validate_registration(internal):
        registration_fields = ['registration_capacity', 'registration_deadline', 'starting_time', 'location']
        if 'has_registration' in internal and internal['has_registration']:
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
        else:
            for field in registration_fields:
                if field in internal:
                    internal.pop(field)

    class Meta:
        model = Activity
        exclude = ('user', 'users_viewed')


class RegistrationSerializer(serializers.ModelSerializer):
    """Standard model serializer for Registration"""

    class Meta:
        model = Registration
        fields = '__all__'


class FavoriteSerializer(serializers.ModelSerializer):
    """Standard model serializer for Favorite"""

    class Meta:
        model = Favorite
        fields = '__all__'


class LogSerializer(serializers.ModelSerializer):
    """Standard model serializer for Log"""

    def to_representation(self, instance):
        log_representation = super().to_representation(instance)
        log_representation.pop("user")
        log_representation["log_id"] = log_representation.pop("id")
        log_representation["log_timestamp"] = log_representation.pop("timestamp")
        
        activity_representation = ActivitySerializer().to_representation(instance.activity)
        activity_representation.pop("id")
        
        return {**log_representation, **activity_representation}

    class Meta:
        model = Log
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    """Standard model serializer for Profile"""

    class Meta:
        model = Profile
        fields = '__all__'


class UserAndProfileSerializer(serializers.ModelSerializer):
    """Serializer for combining user and profile information"""

    phone_number = serializers.CharField(source="profile.phone_number", max_length=11, allow_blank=True)
    is_organization = serializers.BooleanField(source="profile.is_organization", read_only=True)
    avatar = serializers.ImageField(source="profile.avatar", allow_null=True, allow_empty_file=True, required=False)

    def update(self, instance, validated_data):
        instance.profile.__dict__.update(validated_data.pop('profile'))
        instance.profile.save()
        return super().update(instance, validated_data)

    class Meta:
        model = User
        fields = ("username", "email", "phone_number", "is_organization", "avatar")


class CategorySerializer(serializers.ModelSerializer):
    """Standard model serializer for Category"""

    class Meta:
        model = Category
        fields = "__all__"


class ImageSerializer(serializers.ModelSerializer):
    """Standard model serializer for Category"""

    class Meta:
        model = Image
        fields = "__all__"
