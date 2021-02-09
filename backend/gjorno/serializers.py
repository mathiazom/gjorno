from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields = ('id','title','description','categories','user',)

