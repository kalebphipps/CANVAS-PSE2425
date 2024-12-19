from rest_framework import serializers
from editor.models import Project, Heliostat, Receiver, Lightsource, Settings


class HeliostatSerializer(serializers.ModelSerializer):
    """
    Creates a representation of a heliostat
    """

    class Meta:
        model = Heliostat
        fields = ["id"]


class ReceiverSerializer(serializers.ModelSerializer):
    """
    Creates a representation of a receiver
    """

    class Meta:
        model = Receiver
        fields = ["id"]


class LightsourceSerializer(serializers.ModelSerializer):
    """
    Creates a representation of a lightsource
    """

    class Meta:
        model = Lightsource
        fields = ["id"]


class SettingsSerializer(serializers.ModelSerializer):
    """
    Creates a representation of the settings
    """

    class Meta:
        model = Settings
        fields = ["shadows", "fog"]


class ProjectSerializer(serializers.ModelSerializer):
    """
    Create a short representation of a project, not containing the foreign fields
    """

    class Meta:
        model = Project
        fields = ["id", "name"]


class ProjectDetailSerializer(serializers.ModelSerializer):
    """
    Creates a more detailed representation of a project containing all foreign fields
    """

    heliostats = HeliostatSerializer(many=True, read_only=True)
    receivers = ReceiverSerializer(many=True, read_only=True)
    lightsources = LightsourceSerializer(many=True, read_only=True)
    settings = SettingsSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            "name",
            "heliostats",
            "receivers",
            "lightsources",
            "settings",
        ]
