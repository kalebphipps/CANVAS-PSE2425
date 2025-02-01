from django.shortcuts import render
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.contrib.auth import login, update_session_auth_hash, logout
from .forms import RegisterForm, LoginForm, UpdateAccountForm, DeleteAccountForm   
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.contrib import messages

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

@login_required
def update_account(request):
    user = request.user
    if request.method == 'POST':
        form = UpdateAccountForm(instance=request.user, data=request.POST)
        if form.is_valid():
            user.first_name = form.cleaned_data['first_name']
            user.last_name = form.cleaned_data['last_name'] 
            user.email = form.cleaned_data['email']
            user.username = user.email

            old_password = form.cleaned_data['old_password']
            new_password = form.cleaned_data['new_password']

            if old_password and new_password:
                user.set_password(new_password)
                update_session_auth_hash(request, user)

            user.save()
            messages.success(request, "Your account has been updated successfully.")
        else:
            for field in form:
                for error in field.errors:
                    messages.error(request, f"Error in {field.label}: {error}")
        return redirect(request.META.get("HTTP_REFERER", "index"))


def delete_account(request):
    if request.method == 'POST':
        form = DeleteAccountForm(request.user, request.POST)
        if form.is_valid():
            request.user.delete()
            return redirect(REDIRECT_LOGIN_URL)
        else:
            for field in form:
                for error in field.errors:
                    messages.error(request, f"Error in {field.label}: {error}")
        
    return redirect(request.META.get("HTTP_REFERER", "index"))