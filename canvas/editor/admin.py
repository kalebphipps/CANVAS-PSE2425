from django.contrib import admin
from editor.models import Project, Heliostat, Receiver, Lightsource, Settings

# Register your models here.
admin.site.register(Project)
admin.site.register(Heliostat)
admin.site.register(Receiver)
admin.site.register(Lightsource)
admin.site.register(Settings)
