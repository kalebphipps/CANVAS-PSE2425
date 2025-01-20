from django.urls import path

from . import views

urlpatterns = [
    path("", views.projects, name="projects"),
    path("deleteProject/<str:project_name>", views.deleteProject, name="deleteProject"),
    path("favoreProject/<str:project_name>", views.favoreProject, name="favoreProject"),
    path(
        "defavoreProject/<str:project_name>",
        views.defavoreProject,
        name="defavoreProject",
    ),
]
