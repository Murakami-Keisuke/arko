# Generated by Django 4.0.1 on 2022-02-11 07:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('arko', '0006_alter_status_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='status',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='arko.arkogroup'),
        ),
    ]