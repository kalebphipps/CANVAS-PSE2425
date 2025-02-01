from django.contrib import admin
from project_management.models import (
    Project,
    SharedProject,
    Heliostat,
    Receiver,
    Lightsource,
    Settings,
)


# Regestering all models
admin.site.register(Project)
admin.site.register(SharedProject)
admin.site.register(Heliostat)
admin.site.register(Receiver)
admin.site.register(Lightsource)
admin.site.register(Settings)
