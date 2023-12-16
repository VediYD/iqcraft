function fileUploader(event) {
  document.getElementById("file-input").click();
}

function dragFileIn(event) {
    event.preventDefault();

    var dragoverText = document.getElementById("dragover-upload-text")
    var defaultText = document.getElementById("default-upload-text")

    defaultText.style.display = "none";
    dragoverText.style.display = "block";
}

function dragFileOut(event) {
    event.preventDefault();

    var dragoverText = document.getElementById("dragover-upload-text")
    var defaultText = document.getElementById("default-upload-text")

    defaultText.style.display = "block";
    dragoverText.style.display = "none";
}

function dropFile(event) {
    event.preventDefault();

    var dragoverText = document.getElementById("dragover-upload-text")
    var defaultText = document.getElementById("default-upload-text")

    defaultText.style.display = "block";
    dragoverText.style.display = "none";

    var uploadContainer = document.getElementById("new-upload");

    var files = event.dataTransfer.files;
    sendFilesToDjango(files);
}

function sendFilesToDjango(files) {
    var formData = new FormData();

    for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
    }

    fetch('/your-django-endpoint/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

}
