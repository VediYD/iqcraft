function extractFileNameFromUrl(url) {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 2];
    return fileName;
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

function togglePanel(panelId) {
    let panel = document.getElementById(panelId);
    const panelIsCollapsed = panel.classList.contains('collapsed');
    if (panelIsCollapsed) {
        panel.classList.remove('collapsed');
    } else {
        panel.classList.add('collapsed');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = window.location.href;
    const fileName = extractFileNameFromUrl(currentUrl);
    fetchFileInfo(fileName);
});
