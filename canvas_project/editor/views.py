from django.shortcuts import render, get_object_or_404
from project_management.models import Project
from django.http import FileResponse

import os
from django.conf import settings


def editor(request, project_name):
    """
    Handles the editor view for a given project.

    Attributes
    ----------
    request : HttpRequest
        The request the user send to get here
    project_name : str
        The project_name specified as a url parameter
    """

    # Return 404 not found if user has no project with this id
    project = get_object_or_404(Project, name=project_name, owner=request.user)

    return render(
        request,
        "editor/editor.html",
        context={"project_id": project.pk, "project_name": project.name},
    )


def download(request, project_name):
    """
    Converts the specified project into a hdf5 file and downloads it.

    Attributes
    ----------
    request : HttpRequest
        The request the user send to get here
    project_name : str
        The project_name specified as a url parameter
    """

    # Placeholder for actual download functionality added later
    project = get_object_or_404(Project, name=project_name, owner=request.user)

    path = os.path.join(
        settings.BASE_DIR, "static/artist/test_scenario_alignment_optimization.h5"
    )
    file = open(path, "rb")
    response = FileResponse(file)
    response["Content-Type"] = "application/octet-stream"
    response["Content-Disposition"] = (
        f'attachment; filename="{project.name}.{file.name.split('.')[1]}"'
    )
    return response
