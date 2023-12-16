function fileUploader(event) {
  document.getElementById("file-input").click();
}

function dragFileIn(event) {
    event.preventDefault();

    let dragoverText = document.getElementById("dragover-upload-text")
    let defaultText = document.getElementById("default-upload-text")

    defaultText.style.display = "none";
    dragoverText.style.display = "block";
}

function dragFileOut(event) {
    event.preventDefault();

    let dragoverText = document.getElementById("dragover-upload-text")
    let defaultText = document.getElementById("default-upload-text")

    defaultText.style.display = "block";
    dragoverText.style.display = "none";
}

function dropFile(event) {
    event.preventDefault();

    let dragoverText = document.getElementById("dragover-upload-text")
    let defaultText = document.getElementById("default-upload-text")

    defaultText.style.display = "block";
    dragoverText.style.display = "none";

    const files = event.dataTransfer.files;
    sendFilesToDjango(files);
}

function sendFilesToDjango(files) {
    const csrftoken = getCookie('csrftoken');
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

function getCookie(name) {
  const dc = document.cookie;
  const prefix = name + "=";
  let begin = dc.indexOf("; " + prefix);
  let end = document.cookie.indexOf(";", begin);

  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  }
  else {
    begin += 2;
    if (end == -1) {
      end = dc.length;
    }
  }
  return decodeURI(dc.substring(begin + prefix.length, end));
}
