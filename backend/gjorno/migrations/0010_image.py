# Generated by Django 3.1.6 on 2021-03-20 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gjorno', '0009_merge_20210317_0937'),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('image', models.ImageField(blank=True, upload_to='uploads/')),
            ],
        ),
    ]
