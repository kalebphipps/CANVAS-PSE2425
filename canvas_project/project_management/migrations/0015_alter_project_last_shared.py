# Generated by Django 5.1.4 on 2025-02-02 13:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "project_management",
            "0014_project_last_shared_alter_project_last_edited_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="project",
            name="last_shared",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
