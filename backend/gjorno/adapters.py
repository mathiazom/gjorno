"""
Adapters to customize allauth configuration
"""

from allauth.account.adapter import DefaultAccountAdapter
from .models import Profile


class UserWithProfileAdapter(DefaultAccountAdapter):
    """
    Customize default account behaviour
    """

    def save_user(self, request, user, form, commit=False):
        user = super().save_user(request, user, form, commit)
        user.save()
        data = form.cleaned_data
        Profile.objects.create(
            user=user, phone_number=data.get('phone_number'),
            is_organization=data.get('is_organization'),
            avatar=data.get('avatar')
        )
        return user
