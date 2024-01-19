from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.utils.datastructures import MultiValueDictKeyError
from django.views.decorators.http import require_POST
from django.conf import settings
from os import listdir, path as os_path

from .models import FileInfo
from .clients import process_file


def login(request):
    return render(request, "login.html")


def home(request):
    return render(request, "homepage.html")


def editor(request, file_name):
    return render(request, "editor.html")


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


@require_POST
def delete_file(request):
    if request.method == 'POST':
        file_name = request.POST.get('file_name', None)

        if file_name:
            file_path = os_path.join(settings.MEDIA_ROOT, file_name)

            try:
                default_storage.delete(file_path)
                return JsonResponse({'status': 'success', 'message': f'File {file_name} deleted successfully.'})
            except OSError as e:
                return JsonResponse({'status': 'error', 'message': f'Error deleting file: {str(e)}'})
        else:
            return JsonResponse({'status': 'error', 'message': 'File name not provided in the request.'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})


def get_file_info(request, file_name):
    try:
        # first check database for information
        file_info = FileInfo.objects.get(file_name=file_name)
        return JsonResponse({'status': 'success', 'file_info': file_info.to_dict()})
    except FileInfo.DoesNotExist:
        # if no data exists, process the file and save data to database
        processed_info = process_file(file_name)
        FileInfo.objects.create(
            file_name=processed_info['name'],
            location=processed_info['location'],
        )
        return JsonResponse({'status': 'success', 'file_info': processed_info})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

