# Generated by Django 3.1.6 on 2021-03-21 20:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gjorno', '0015_auto_20210321_2111'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(blank=True, upload_to='uploads/avatars/'),
        ),
    ]
