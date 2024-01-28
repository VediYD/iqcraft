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

function loadEditor(fileName) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);

    const redirectUrl = `/impart/loadEditor/${fileName}/`
    window.location.href = redirectUrl;
}