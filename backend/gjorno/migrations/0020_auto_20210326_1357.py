# Generated by Django 3.1.6 on 2021-03-26 13:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gjorno', '0019_auto_20210324_1136'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='phone_number',
            field=models.CharField(blank=True, max_length=11),
        ),
    ]
