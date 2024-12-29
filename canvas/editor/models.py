from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Project(models.Model):
    """
    Represents a project in the database, contains all the necessary fields to configure a project
    """

    name = models.CharField(max_length=300)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        # Make each combination of owner and project name unique
        unique_together = [["name", "owner"]]

    # Overwrite the orignal save method to create a settings object each time a new project is created
    def save(self, *args, **kwargs):
        # Call the original save method
        super(Project, self).save(*args, **kwargs)
        # Create a settings object for this project
        Settings.objects.create(project=self)

    def __str__(self) -> str:
        return self.name


class Heliostat(models.Model):
    """
    Represents a Heliostat in the database, contains all the necessary fields to configure a heliostat
    """

    project = models.ForeignKey(
        # related name is needed for accessing the foreign key
        Project,
        related_name="heliostats",
        on_delete=models.CASCADE,
    )


class Receiver(models.Model):
    """
    Represents a receiver in the database, contains all the necessary fields to configure a receiver
    """

    project = models.ForeignKey(
        Project, related_name="receivers", on_delete=models.CASCADE
    )


class Lightsource(models.Model):
    """
    Represents a lightsource in the database, contains all the necessary fields to configure a lightsource
    """

    project = models.ForeignKey(
        Project, related_name="lightsources", on_delete=models.CASCADE
    )


class Settings(models.Model):
    """
    Represents the settings in the database, contains all the necessary fields to configure the settings for a project
    """

    project = models.OneToOneField(
        Project, related_name="settings", on_delete=models.CASCADE
    )
    shadows = models.BooleanField(default=True)
    fog = models.BooleanField(default=True)
