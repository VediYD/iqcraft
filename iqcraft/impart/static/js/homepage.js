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

