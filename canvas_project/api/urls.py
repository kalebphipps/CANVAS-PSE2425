from django.urls import path
from .views import (
    ProjectList,
    ProjectDetailList,
    HeliostatList,
    HeliostatDetail,
    ReceiverList,
    ReceiverDetail,
    LightsourceList,
    LightsourceDetail,
    SettingsDetail,
)

urlpatterns = [
    path("projects/", ProjectList.as_view()),
    path("projects/<int:pk>/", ProjectDetailList.as_view()),
    path("projects/<int:project_id>/heliostats/", HeliostatList.as_view()),
    path(
        "projects/<int:project_id>/heliostats/<int:pk>/",
        HeliostatDetail.as_view(),
    ),
    path("projects/<int:project_id>/receivers/", ReceiverList.as_view()),
    path("projects/<int:project_id>/receivers/<int:pk>/", ReceiverDetail.as_view()),
    path("projects/<int:project_id>/lightsources/", LightsourceList.as_view()),
    path(
        "projects/<int:project_id>/lightsources/<int:pk>/", LightsourceDetail.as_view()
    ),
    path("projects/<int:project_id>/settings/", SettingsDetail.as_view()),
]
