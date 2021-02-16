from allauth.account.adapter import DefaultAccountAdapter
from .models import Profile


class UserWithProfileAdapter(DefaultAccountAdapter):

    def save_user(self, request, user, form, commit=False):
        user = super().save_user(request, user, form, commit)
        user.save()
        data = form.cleaned_data
        Profile.objects.create(user=user, phone_number=data.get('phone_number'))
        return user
