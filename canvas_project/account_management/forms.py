from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm


class RegisterForm(forms.Form):
    """
    A form for registering a new user. It includes fields for email, password,
    and password confirmation. It also validates that the two passwords match.
    """

    first_name = forms.CharField(label="First name")
    last_name = forms.CharField(label="Last name")
    email = forms.EmailField(label="Email")
    password = forms.CharField(label="password", widget=forms.PasswordInput)
    password_confirmation = forms.CharField(
        label="Confirm password", widget=forms.PasswordInput
    )

    def clean_email(self):
        """
        Checks if the email already exists.
        """
        email = self.cleaned_data.get("email")
        if User.objects.filter(email=email).exists():
            self.add_error(
                "email", "This email address is already in use. Please try another."
            )
        return email

    def clean(self):
        """
        Validates that the two passwords match. If they do not, a validation error
        is raised.
        """
        cleaned_data = super().clean()
        password = self.cleaned_data.get("password")
        password_confirmation = self.cleaned_data.get("password_confirmation")

        if password != password_confirmation:
            self.add_error(
                "password", "The passwords you entered do not match. Please try again."
            )

        return cleaned_data


class LoginForm(forms.Form):
    email = forms.EmailField(label="Email")
    password = forms.CharField(label="Password", widget=forms.PasswordInput)

    def clean(self):
        email = self.cleaned_data.get("email")
        password = self.cleaned_data.get("password")

        # Check if the user with this email exists
        user = User.objects.filter(email=email).first()
        if not user:
            self.add_error("email", "This email address is not registered.")
        elif not user.check_password(password):
            self.add_error("password", "The password you entered is incorrect.")
        else:
            self.user = user

        return self.cleaned_data

    def get_user(self):
        return self.user
