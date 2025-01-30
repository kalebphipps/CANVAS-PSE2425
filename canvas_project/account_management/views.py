from django.shortcuts import render
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.contrib.auth import login
from .forms import RegisterForm, LoginForm
from django.contrib.auth import logout
from django.views.decorators.http import require_POST

REDIRECT_PROJECTS_URL = "projects"
REDIRECT_LOGIN_URL = "login"


def register_view(request):
    """
    Register a new user and redirect to the login page upon success.
    If the user is already logged in, redirect to the projects page.
    """

    if request.user.is_authenticated:
        return redirect(REDIRECT_PROJECTS_URL)

    if request.method == "POST":

        form = RegisterForm(request.POST)
        if form.is_valid():
            first_name = form.cleaned_data.get("first_name")
            last_name = form.cleaned_data.get("last_name")
            email = form.cleaned_data.get("email")
            password = form.cleaned_data.get("password")
            user = User(
                first_name=first_name,
                last_name=last_name,
                email=email,
                username=email,
            )
            user.set_password(password)
            user.save()
            login(request, user)
            return redirect(REDIRECT_PROJECTS_URL)
    else:
        form = RegisterForm()
    return render(request, "register.html", {"form": form})


def login_view(request):
    """
    Log in the user and redirect to the projects page upon success.
    If the user is already logged in, redirect to the projects page.
    """

    if request.user.is_authenticated:
        return redirect(REDIRECT_PROJECTS_URL)

    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return redirect(REDIRECT_PROJECTS_URL)
    else:
        form = LoginForm()
    return render(request, "login.html", {"form": form})


@require_POST
def logout_view(request):
    """
    Log out the current user and redirect to the login page.
    """
    logout(request)
    return redirect(REDIRECT_LOGIN_URL)
