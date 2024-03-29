# Generated by Django 3.1.6 on 2021-03-28 11:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('gjorno', '0019_auto_20210324_1136'),
    ]

    operations = [
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='gjorno.activity', verbose_name='Activity')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
        ),
    ]
