from django.urls import path

from . import views

urlpatterns = [
    path("", views.login_view, name="login"),
    path("register/", views.register_view, name="register"),
    path("logout/", views.logout_view, name="logout"),
    path("update_account/", views.update_account, name="update_account"),
    path("delete_account/", views.delete_account, name="delete_account"),
]
