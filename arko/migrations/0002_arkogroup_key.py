# Generated by Django 4.0.1 on 2022-01-29 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('arko', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='arkogroup',
            name='key',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]