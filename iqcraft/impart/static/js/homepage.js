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
    var csrftoken = getCookie('csrftoken');
    var headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);

    var formData = new FormData();

    for (var i = 0; i < files.length; i++) {
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

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  }
  else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  return decodeURI(dc.substring(begin + prefix.length, end));
}
