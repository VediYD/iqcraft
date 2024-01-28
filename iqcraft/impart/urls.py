"""
URL configuration for iqcraft project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import home, login_view, upload_files, get_file_list
from .views import delete_file, get_file_info, editor, save_progress

urlpatterns = [
    path('login', login_view, name='login'),
    path('home', home, name='home'),
    path('uploadFiles', upload_files, name='upload_files'),
    path('getFiles', get_file_list, name='get_file_list'),
    path('deleteFile', delete_file, name='delete_file'),
    path('getFileInfo/<str:file_name>/', get_file_info, name='get_file_info'),
    path('loadEditor/<str:file_name>/', editor, name='loadEditor'),
    path('saveProgress/', save_progress, name='save_progress'),
]

