# Generated by Django 3.1.6 on 2021-03-21 20:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gjorno', '0016_auto_20210321_2112'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='uploads/activities/'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='uploads/avatars/'),
        ),
    ]
