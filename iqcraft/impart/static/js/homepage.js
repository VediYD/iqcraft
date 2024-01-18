function fileUploader(event) {
  // click on the hidden file upload form
  document.getElementById("file-input").click();
}

function dragFileIn(event) {
    event.preventDefault();

    let dragoverText = document.getElementById("dragover-upload-text")
    let defaultText = document.getElementById("default-upload-text")

    // when user drags a file over, prompt the user to show the drop div instead of drag and drop div
    defaultText.style.display = "none";
    dragoverText.style.display = "block";
}

function dragFileOut(event) {
    event.preventDefault();

    let dragoverText = document.getElementById("dragover-upload-text")
    let defaultText = document.getElementById("default-upload-text")

    // when user drags a file out, prompt the user to show the drag and drop div instead of the drag div
    defaultText.style.display = "block";
    dragoverText.style.display = "none";
}

function dropFile(event) {
    event.preventDefault();

    let dragoverText = document.getElementById("dragover-upload-text")
    let defaultText = document.getElementById("default-upload-text")

    // when user drops a file, reset to original div
    // TODO: change this to trigger open editor with last uploaded file
    defaultText.style.display = "block";
    dragoverText.style.display = "none";

    const files = event.dataTransfer.files;
    sendFilesToDjango(files);
}

function sendFilesToDjango(files) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let headers = new Headers();
    let formData = new FormData();
    let i;

    headers.append('X-CSRFToken', csrftoken);

    for (i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
    }

    fetch('/impart/uploadFiles', {
        method: 'POST',
        body: formData,
        headers: headers
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

function deleteFile(fileName) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);

    let formData = new FormData();
    formData.append('file_name', fileName);

    fetch('/impart/deleteFile', {
        method: 'POST',
        body: formData,
        headers: headers
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == 'success') {
            console.log(`File ${fileName} deleted successfully.`);
        } else {
            console.error('Error: Unable to delete file -', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function fetchFileInfo(fileName) {
    fetch(`/impart/getFileInfo/${fileName}/`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // todo: handle file info
                console.log('File Information:', data.file_info);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function loadEditor(fileName) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);

    fetch(`/impart/getFileContent?fileName=${fileName}`, {
        method: 'GET',
        headers: headers
    })
    .then(response => response.text())
    .then(content => {

        const editorContainer = document.getElementById('editor-container');
        editorContainer.innerHTML = content;

        fetchFileInfo(fileName);

        const overlay = document.getElementById("file-list-overlay");
        overlay.classList.add('hidden');
    })
    .catch(error => {
        console.error('Error fetching file content:', error);
    });
}

function openFileNav(event) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let headers = new Headers();
    let formData = new FormData();
    headers.append('X-CSRFToken', csrftoken);

    const overlay = document.getElementById("file-list-overlay")
    overlay.addEventListener('click', () => {
        overlay.classList.add('hidden')
    });

    // get the list of available documents from django /impart/getFiles
    fetch('/impart/getFiles', {
        method: 'POST',
        body: formData,
        headers: headers
    })
    .then(response => response.json())
    .then(data => {
        if (data.status=='success'){
            // modify the file-nav-window
            const fileNavWindow = document.getElementById('file-list');
            fileNavWindow.innerHTML = '';

            // add a new row for each file
            data.message.forEach(file => {
                const listItem = document.createElement('div');
                listItem.classList.add('file-list-item');

                // add an edit icon
                const editIcon = document.createElement('span');
                editIcon.classList.add('edit-icon');
                editIcon.textContent = '✎';

                // add a delete icon
                const deleteIcon = document.createElement('span');
                deleteIcon.classList.add('delete-icon');
                deleteIcon.textContent = '❌';

                // add filename
                const fileName = document.createElement('span');
                fileName.classList.add('file-name')
                fileName.textContent = file;

                // add items to list in order
                listItem.appendChild(fileName);
                listItem.appendChild(editIcon);
                listItem.appendChild(deleteIcon);

                // event handler for file open
                fileName.addEventListener('click', () => {
                    console.log(`Opening editor for file: ${file}`);
                    overlay.classList.add('hidden')
                    loadEditor(file);
                });

                editIcon.addEventListener('click', () => {
                    console.log(`Opening editor for file: ${file}`);
                    overlay.classList.add('hidden')
                    loadEditor(file);
                });

                deleteIcon.addEventListener('click', () => {
                    const confirmDelete = window.confirm(`Are you sure you want to delete the file: ${file}?`);

                    if (confirmDelete) {
                        deleteFile(file);
                    }

                    overlay.classList.add('hidden');
                });

                fileNavWindow.appendChild(listItem);
            });

            const plusButton = document.createElement('div');
            plusButton.classList.add('file-list-item', 'plus-button');
            plusButton.innerHTML = '+';

            plusButton.addEventListener('click', () => {
                document.getElementById("file-input").click();
                overlay.classList.remove('hidden')
            });

            fileNavWindow.appendChild(plusButton);
        }  else {
            console.error('Error: Unexpected status -', data.status);
        }
    })
    .then(()=> {
        // remove the class attribute hidden
        overlay.classList.remove('hidden')
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
