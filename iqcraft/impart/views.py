from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.utils.datastructures import MultiValueDictKeyError
from django.views.decorators.http import require_POST
from django.conf import settings
from os import listdir


def login(request):
    return render(request, "login.html")


def home(request):
    return render(request, "homepage.html")


@require_POST
def upload_files(request):
    try:
        # save file to documents folder
        # TODO: save as per username, separate files for separate users
        # fetch this information from the database to know where the document needs to be saved

        for file in request.FILES.getlist('file'):
            file_path = default_storage.save(file.name, file)

        return JsonResponse({'status': 'success', 'message': 'File uploaded successfully'})
    except MultiValueDictKeyError:
        return JsonResponse({'status': 'error', 'message': 'No file provided'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})


@require_POST
def get_file_list(request):
    try:
        # TODO: extract user name from request and fetch that user's documents specifically
        files = listdir(settings.MEDIA_ROOT)

        return JsonResponse({"status": 'success', 'message': files})
    except Exception as e:
        return JsonResponse({"status": 'error', "message": str(e)})
