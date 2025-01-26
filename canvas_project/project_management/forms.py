from django.forms import ModelForm
from .models import Project


class ProjectForm(ModelForm):
    class Meta:
        model = Project
        fields = ["name", "description"]


class UpdateProjectForm(ModelForm):
    class Meta:
        model = Project
        fields = ["name", "description"]
