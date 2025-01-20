from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import redirect, render
from .models import Project
from .forms import ProjectForm
from datetime import datetime


# General project handling
def projects(request):
    form = ProjectForm()
    if request.method == "GET":
        all_projects = Project.objects.order_by("last_edited")
        context = {"projects": all_projects, "form": form}
        return render(request, "project_management/projects.html", context)
    elif request.method == "POST":
        form = ProjectForm(request.POST)
        if form.is_valid():
            form = form.save(commit=False)
            form.owner = request.user
            form.last_edited = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            form.save()
            return HttpResponseRedirect(reverse("projects"))
        return render(request, "project", {"form": form})


# Deleting a project
def deleteProject(request, project_name):
    project = Project.objects.get(owner=request.user, name=project_name)
    project.delete()
    return redirect("projects")


# Set project to favorite
def favorProject(request, project_name):
    project = Project.objects.get(owner=request.user, name=project_name)
    project.favorite = "true"
    project.save(update_fields=["favorite"])
    return redirect("projects")


# Set project to not favorite
def defavorProject(request, project_name):
    project = Project.objects.get(owner=request.user, name=project_name)
    project.favorite = "false"
    project.save(update_fields=["favorite"])
    return redirect("projects")
