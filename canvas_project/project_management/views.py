from django.http import HttpResponse
from django.shortcuts import render
from django import template
from .models import Project


def projects(request):
    if request.method == "GET":
        all_projects = Project.objects.order_by("last_edited")
        context = {"projects": all_projects}
        return render(request, "project_management/projects.html", context)
    elif request.method == "POST":
        project_name = request.POST.get("project_name")
        project_description = request.POST.get("project_description")
        project = Project.objects.create(
            name=project_name, descrition=project_description
        )
        return HttpResponse()
