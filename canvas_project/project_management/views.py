from django.shortcuts import render


def projects(request):
    return render(
        request,
        "project_management/projects.html",
        context={
            "projects": [
                {
                    "name": "Project A",
                    "description": "This is a description of project A",
                    "last_edited": "15.11.2024",
                    "favorite": "true",
                    "preview": "img/test.png",
                },
                {
                    "name": "Project B",
                    "description": "This is a description of project B",
                    "last_edited": "15.11.2024",
                    "favorite": "false",
                    "preview": "img/test.png",
                },
                {
                    "name": "Project C",
                    "description": "This is a description of project C",
                    "last_edited": "15.11.2024",
                    "favorite": "true",
                    "preview": "img/test.png",
                },
                {
                    "name": "Project D",
                    "description": "This is a description of project D",
                    "last_edited": "15.11.2024",
                    "favorite": "true",
                    "preview": "img/test.png",
                },
                {
                    "name": "Project E",
                    "description": "This is a description of project E",
                    "last_edited": "15.11.2024",
                    "favorite": "false",
                    "preview": "img/test.png",
                },
            ]
        },
    )
