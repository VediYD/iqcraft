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
                });

                editIcon.addEventListener('click', () => {
                    console.log(`Opening editor for file: ${file}`);
                    overlay.classList.add('hidden')
                });

                // TODO: event handler for file deletion
                deleteIcon.addEventListener('click', () => {
                    console.log(`Deleting file: ${file}`);
                    overlay.classList.add('hidden')
                });

                // Append the list item to the file-nav-window
                fileNavWindow.appendChild(listItem);
            });
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
