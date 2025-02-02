from django import forms
from django.contrib.auth.models import User



class RegisterForm(forms.Form):
    """
    A form for registering a new user. It includes fields for email, password,
    and password_confirmation. It also validates that the two passwords match.
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

    def clean_password(self):
        """
        Validates the password based on security criteria.
        """
        password = self.cleaned_data.get("password")

        if len(password) < 8:
            self.add_error("password", "Password must be at least 8 characters long.")
        if not any(char.isdigit() for char in password):
            self.add_error("password", "Password must contain at least one digit.")
        if not any(char.isupper() for char in password):
            self.add_error(
                "password", "Password must contain at least one uppercase letter."
            )
        if not any(char.islower() for char in password):
            self.add_error(
                "password", "Password must contain at least one lowercase letter."
            )
        if not any(char in "!@#$%^&*()-_+=<>?/" for char in password):
            self.add_error(
                "password",
                "Password must contain at least one special character (!@#$%^&*()-_+=<>?/).",
            )
        return password

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
    """
    A form for logging in an existing user. It includes fields for email and
    password. It also validates that the email exists and that the password is
    correct.
    """

    email = forms.EmailField(label="Email")
    password = forms.CharField(label="Password", widget=forms.PasswordInput)

    def clean(self):
        """
        Validates that the email exists and that the password is correct. If the
        email does not exist or the password is incorrect, a validation error is
        raised.
        """
        email = self.cleaned_data.get("email")
        password = self.cleaned_data.get("password")
        user = User.objects.filter(email=email).first()

        # Check if the user with this email exists and the password is correct.
        if not user:
            self.add_error("email", "This email address is not registered.")
        elif not user.check_password(password):
            self.add_error("password", "The password you entered is incorrect.")
        else:
            self.user = user

        return self.cleaned_data

    def get_user(self):
        """
        Returns the user object if the form is valid.
        """
        return self.user

class UpdateAccountForm(forms.ModelForm):
    """
    A form for updating the user's account information. It includes fields for
    first_name, last_name, and email. It also includes fields for the old password,
    new password, and password_confirmation. It validates that the old password is
    correct, that the new password passes the security criteria, and that the two
    new passwords match.
    """
    
    first_name = forms.CharField(label="First name", required=False)
    last_name = forms.CharField(label="Last name", required=False)
    email = forms.EmailField(label="Email", required=False)

    old_password = forms.CharField(widget=forms.PasswordInput, required=False, label="old_password")
    new_password = forms.CharField(widget=forms.PasswordInput, required=False, label="new_password")
    password_confirmation = forms.CharField(widget=forms.PasswordInput, required=False, label="password_confirmation")

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email"]

    def clean_email(self):
        """
        Validates the email address.
        """
        email = self.cleaned_data.get("email")
        if User.objects.filter(email=email).exclude(id=self.instance.id).exists():
            self.add_error(
                "email", "This email address is already in use. Please try another."
            )
        return email
    
    def clean_old_password(self):
        """
        Validates the old password.
        """
        old_password = self.cleaned_data.get("old_password")
        if old_password and not self.instance.check_password(old_password):
            self.add_error("old_password", "The password you entered is incorrect.")
        return old_password
    
    def clean_new_password(self):
        """
        Validates that the new password passes the sequrity meassurements.
        """
        new_password = self.cleaned_data.get("new_password")

        if new_password:
            if len(new_password) < 8:
                self.add_error("new_password", "Password must be at least 8 characters long.")
            if not any(char.isdigit() for char in new_password):
                self.add_error("new_password", "Password must contain at least one digit.")
            if not any(char.isupper() for char in new_password):
                self.add_error(
                    "new_password", "Password must contain at least one uppercase letter."
                )
            if not any(char.islower() for char in new_password):
                self.add_error(
                    "new_password", "Password must contain at least one lowercase letter."
                )
            if not any(char in "!@#$%^&*()-_+=<>?/" for char in new_password):
                self.add_error(
                    "new_password",
                    "Password must contain at least one special character (!@#$%^&*()-_+=<>?/).",
                )
        return new_password
    
    def clean_password_confirmation(self):
        """
        Validates that the two new passwords match. If they do not, a validation error
        is raised.
        """
        new_password = self.cleaned_data.get("new_password")
        password_confirmation = self.cleaned_data.get("password_confirmation")

        if new_password and new_password != password_confirmation:
            self.add_error(
                "password_confirmation", "The passwords you entered do not match. Please try again."
            )

        return password_confirmation
    
    def clean(self):
        """
        Validates that the old password is entered when a new password is entered.
        """
        old_password = self.cleaned_data.get("old_password")
        new_password = self.cleaned_data.get("new_password")

        if old_password and not new_password:
            self.add_error("new_password", "Please enter a new password.")
        if new_password and not old_password:
            self.add_error("old_password", "Please enter your current password.")

        return self.cleaned_data
    
class DeleteAccountForm(forms.Form):
    """
    A form for deleting an account. It includes a field for the password.
    """

    password = forms.CharField(label="Password", widget=forms.PasswordInput)

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)

    def clean_password(self):
        """
        Validates the password.
        """
        password = self.cleaned_data.get("password")
        if not self.user.check_password(password):
            self.add_error("password", "The password you entered is incorrect.")
        return password