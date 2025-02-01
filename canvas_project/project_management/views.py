from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import redirect, render
from .models import Project, SharedProject
from .forms import ProjectForm, UpdateProjectForm
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.db.models import CharField, Value

import string
import random


# General project handling
@login_required
def projects(request):
    form = ProjectForm()
    if request.method == "GET":
        allProjects = Project.objects.filter(owner=request.user).order_by(
            "-last_edited"
        )
        for project in allProjects:
            project.link = generate_random_string()

        context = {
            "projects": allProjects,
            "form": form,
        }
        return render(request, "project_management/projects.html", context)
    elif request.method == "POST":
        form = ProjectForm(request.POST)
        allProjects = Project.objects.filter(owner=request.user).order_by(
            "-last_edited"
        )
        for project in allProjects:
            project.link = generate_random_string()

        if form.is_valid():
            nameUnique = True
            for existingProject in allProjects:
                if form["name"].value() == existingProject.name:
                    nameUnique = False
            if nameUnique:
                form = form.save(commit=False)
                form.owner = request.user
                form.last_edited = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                form.save()
                return HttpResponseRedirect(reverse("projects"))
        context = {
            "projects": allProjects,
            "form": form,
        }
        return render(request, "project_management/projects.html", context)


@login_required
def updateProject(request, project_name):
    if request.method == "POST":
        project = Project.objects.get(owner=request.user, name=project_name)
        if project.owner == request.user:
            form = UpdateProjectForm(request.POST, instance=project)
            if form.is_valid:
                allProjects = Project.objects.all()
                nameUnique = True
                nameNotChanged = False
                if project_name == form["name"].value():
                    nameNotChanged = True
                for existingProject in allProjects:
                    if form["name"].value() == existingProject.name:
                        nameUnique = False
                if nameUnique or nameNotChanged:
                    project.last_edited = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    form.save()
                    return HttpResponseRedirect(reverse("projects"))
                return redirect("projects")
    return render(
        request,
        "project_management/projects.html",
        {"form": form, project_name: project_name},
    )


# Deleting a project
@login_required
def deleteProject(request, project_name):
    project = Project.objects.get(owner=request.user, name=project_name)
    if project.owner == request.user:
        project.delete()
        return redirect("projects")


# Set project to favorite
@login_required
def favorProject(request, project_name):
    project = Project.objects.get(owner=request.user, name=project_name)
    if project.owner == request.user:
        project.favorite = "true"
        project.save(update_fields=["favorite"])
        return redirect("projects")


# Set project to not favorite
@login_required
def defavorProject(request, project_name):
    project = Project.objects.get(owner=request.user, name=project_name)
    if project.owner == request.user:
        project.favorite = "false"
        project.save(update_fields=["favorite"])
        return redirect("projects")


# Duplicate a project
@login_required
def duplicateProject(request, project_name):
    project = Project.objects.get(owner=request.user, name=project_name)
    if project.owner == request.user:
        fks_to_copy = (
            list(project.heliostats.all())
            + list(project.receivers.all())
            + list(project.lightsources.all())
        )
        settings = project.settings
        project.pk = None

        # Finding a new project name unique to user
        newNameFound = False
        while not newNameFound:
            try:
                Project.objects.get(name=project_name, owner=request.user)
                project_name = project_name + "copy"
            except Project.DoesNotExist:
                project.name = project_name
                project.save()
                newNameFound = True

        # Copy all objects associated to the project via foreign keys
        for assoc_object in fks_to_copy:
            assoc_object.pk = None
            assoc_object.project = project
            assoc_object.save()

        # Copy settings
        settings.pk = None
        settings.project = project
        settings.save()

        return redirect("projects")


# Share a project
@login_required
def shareProject(request, project_name, link):
    # create new sharedProject model
    project = Project.objects.get(owner=request.user, name=project_name)
    SharedProject.objects.create(link=link, project=project)

    return redirect("projects")


@login_required
def sharedProjects(request, link):
    # TODO: Auto delete the shared project model after 72 hours
    # get the shared project
    sharedProject = SharedProject.objects.get(link=link)
    project = sharedProject.project

    # copy the associated project to the user
    fks_to_copy = (
        list(project.heliostats.all())
        + list(project.receivers.all())
        + list(project.lightsources.all())
    )
    settings = project.settings
    project.pk = None

    # Finding a new project name unique to user
    newNameFound = False
    while not newNameFound:
        try:
            project.name = project.name + "_shared"
            Project.objects.get(name=project.name, owner=request.user)
        except Project.DoesNotExist:
            project.name = project.name
            project.owner = request.user
            project.save()
            newNameFound = True

    # Copy all objects associated to the project via foreign keys
    for assoc_object in fks_to_copy:
        assoc_object.pk = None
        assoc_object.project = project
        assoc_object.save()

    # Copy settings
    settings.pk = None
    settings.project = project
    settings.save()

    return redirect("projects")


def generate_random_string(length=15):
    # TODO: Assert uniqueness
    letters = string.ascii_letters + string.digits
    return "".join(random.choice(letters) for i in range(length))
