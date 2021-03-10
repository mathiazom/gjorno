"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from gjorno.views import \
    ActivitiesView,\
    RegistrationsView, \
    ActivityRegisterView, \
    ActivityUnregisterView, \
    CategoriesView, \
    UsersView, \
    CurrentUserView, \
    MyActivitiesView

router = routers.DefaultRouter()
router.register("activities", ActivitiesView, 'activities')
router.register("categories", CategoriesView, 'categories')
router.register("users", UsersView, "users")
router.register("my_activities", MyActivitiesView, 'my_activities')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/current_user/', CurrentUserView.as_view()),
    path('api/activities/<int:activity>/registrations/', RegistrationsView.as_view({'get': 'list'})),
    path('api/activities/<int:activity>/register/', ActivityRegisterView.as_view()),
    path('api/activities/<int:activity>/unregister/', ActivityUnregisterView.as_view()),
    path('auth/', include('rest_auth.urls')),
    path('auth/register/', include('rest_auth.registration.urls'))
]
