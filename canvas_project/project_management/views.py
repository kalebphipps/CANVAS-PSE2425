from django.http import HttpResponseRedirect, Http404
from django.urls import reverse
from django.shortcuts import redirect, render
from .models import Project, SharedProject
from .forms import ProjectForm, UpdateProjectForm
from django.utils import timezone
from django.contrib.auth.decorators import login_required

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
            project.link = _generate_random_string()

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
            project.link = _generate_random_string()

        if form.is_valid():
            nameUnique = True
            for existingProject in allProjects:
                if form["name"].value() == existingProject.name:
                    nameUnique = False
            if nameUnique:
                form = form.save(commit=False)
                form.owner = request.user
                form.last_edited = timezone.now()
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
                    project.last_edited = timezone.now()
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
    # get the shared project
    sharedProject = SharedProject.objects.get(link=link)

    if (timezone.now() - sharedProject.time_stamp).days > 3:
        sharedProject.delete()
        raise Http404

    project = sharedProject.project

    # render a preview where the user can choose to add the project
    if request.method == "GET":
        return render(
            request,
            "project_management/sharedProject.html",
            context={"project": project},
        )

    # copy the project to the user
    elif request.method == "POST":
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


def _generate_random_string(length=15):
    letters = string.ascii_letters + string.digits
    max_attempts = 1000
    for _ in range(max_attempts):
        generatedWord = "".join(random.choice(letters) for _ in range(length))
        if not SharedProject.objects.filter(link=generatedWord).exists():
            return generatedWord
    return None
