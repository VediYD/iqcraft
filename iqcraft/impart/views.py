from os import listdir, path as os_path

from django.conf import settings
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.utils.datastructures import MultiValueDictKeyError
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

from .clients import process_file
from .models import FileInfo, Biases


def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Authenticate user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            # Redirect to a success page or home page
            return redirect('home')  # Replace 'home' with the name of your home page URL
        else:
            return JsonResponse({'status': 'error', 'message': 'No such user.'})
    else:
        return render(request, "login.html")


@login_required
def home(request):
    return render(request, "homepage.html")


@login_required
def editor(request, file_name):
    return render(request, "editor.html")


@login_required
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


@login_required
@require_POST
def get_file_list(request):
    try:
        # TODO: extract user name from request and fetch that user's documents specifically
        files = listdir(settings.MEDIA_ROOT)

        return JsonResponse({"status": 'success', 'message': files})
    except Exception as e:
        return JsonResponse({"status": 'error', "message": str(e)})


@login_required
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


@login_required
def get_file_info(request, file_name):
    def _return_info(_file):
        _file_info = FileInfo.objects.get(file_name=_file)
        _biases_info = Biases.objects.filter(file_info=_file_info).values(
            'model_name', 'bias_text', 'audit_response', 'reasoning'
        )
        response_data = {
            'status': 'success',
            'file_info': _file_info.to_dict(),
            'biases_info': list(_biases_info),
        }
        return response_data

    try:
        return JsonResponse(_return_info(file_name))
    except FileInfo.DoesNotExist:
        # if no data exists, process the file and save data to database
        processed_info = process_file(file_name)
        file_info = FileInfo.objects.create(
            file_name=processed_info['name'],
            location=processed_info['location'],
        )

        for _, bias in processed_info['model_biases'].items():
            for bias_text in bias['biases']:
                Biases.objects.create(
                    file_info=file_info,
                    model_name=bias['model_name'],
                    bias_text=bias_text,
                )

        return JsonResponse(_return_info(file_name))
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
