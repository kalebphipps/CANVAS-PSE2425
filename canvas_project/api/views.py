from rest_framework import generics
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

from editor.models import Project, Heliostat, Receiver, Lightsource, Settings
from .serializers import (
    ProjectSerializer,
    ProjectDetailSerializer,
    HeliostatSerializer,
    ReceiverSerializer,
    LightsourceSerializer,
    SettingsSerializer,
)

# Create your views here.


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
        # Show only the projects the user owns
        return Project.objects.filter(owner=self.request.user)
