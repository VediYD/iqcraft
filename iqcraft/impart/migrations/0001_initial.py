# Generated by Django 4.2.7 on 2024-01-18 22:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FileInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_name', models.CharField(max_length=255, unique=True)),
                ('location', models.CharField(max_length=255)),
                ('file_id', models.CharField(max_length=255)),
            ],
        ),
    ]
