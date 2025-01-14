from django.shortcuts import render

from django.http import HttpResponse


def editor(request):
    return render(request, "editor/editor.html")
