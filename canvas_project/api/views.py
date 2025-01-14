from rest_framework import generics
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

from project_management.models import (
    Project,
    Heliostat,
    Receiver,
    Lightsource,
    Settings,
)
from .serializers import (
    ProjectSerializer,
    ProjectDetailSerializer,
    HeliostatSerializer,
    ReceiverSerializer,
    LightsourceSerializer,
    SettingsSerializer,
)


class ProjectList(generics.ListCreateAPIView):
    """
    Creates a view to list all of the projects of the user who's currently logged in, you can also create a new projectadd.
    """

    serializer_class = ProjectSerializer

    # Accepted authentication classes and the needed permissions to access the API
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    # Overwrite the default function to use the request user as the owner of the project and also create a new settings object
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        # Select only the projects the user owns
        return Project.objects.filter(owner=self.request.user)


class ProjectDetailList(generics.RetrieveUpdateDestroyAPIView):
    """
    Creates a view to list a specific project, specified by the given pk in the url, where you can also delete the project.
    """

    serializer_class = ProjectDetailSerializer

    # Accepted authentication classes and the needed permissions to access the API
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Select only the projects the user owns
        return Project.objects.filter(owner=self.request.user)


class HeliostatList(generics.ListCreateAPIView):
    """
    Creates a view to list all heliostats and create new ones.
    """

    serializer_class = HeliostatSerializer

    # Accepted authentication classes and the needed permissions to access the API
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    # Overwrite the default function to use the project defined by the project_id in the url for saving the heliostat
    def perform_create(self, serializer):
        # kwargs = keyword arguement
        project_id = self.kwargs["project_id"]
        project = generics.get_object_or_404(
            Project, id=project_id, owner=self.request.user
        )
        serializer.save(project=project)

    def get_queryset(self):
        project_id = self.kwargs["project_id"]
        return Heliostat.objects.filter(
            project__id=project_id, project__owner=self.request.user
        )


class HeliostatDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Creates a view to retrieve, edit or delete a specific heliostat, defined by the pk in the url.
    """

    serializer_class = HeliostatSerializer

    # Accepted authentication classes and the needed permissions to access the API
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Heliostat.objects.filter(project__owner=self.request.user)


class ReceiverList(generics.ListCreateAPIView):
    """
    Creates a view to list all receivers or to create a new one.
    """

    serializer_class = ReceiverSerializer

    # Accepted authentication classes and the needed permissions to access the API
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    # Overwrite the default function to use the project defined by the project_id in the url for saving the heliostat
    def perform_create(self, serializer):
        project_id = self.kwargs["project_id"]
        project = generics.get_object_or_404(
            Project, id=project_id, owner=self.request.user
        )
        serializer.save(project=project)

    def get_queryset(self):
        project_id = self.kwargs["project_id"]
        return Receiver.objects.filter(
            project__id=project_id, project__owner=self.request.user
        )


class ReceiverDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Creates a view of a specific receiver to retrieve, edit or delete it.
    """

    serializer_class = ReceiverSerializer

    # Accepted authentication classes and the needed permissions to access the API
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Receiver.objects.filter(project__owner=self.request.user)
