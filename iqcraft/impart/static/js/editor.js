function extractFileNameFromUrl(url) {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 2];
    return fileName;
}

function fetchFileInfo(fileName) {
    fetch(`/impart/getFileInfo/${fileName}/`)
        .then(response => response.json())
        .then(handleData)
        .catch(handleError);
}

function handleData(data) {
    if (data.status === 'success') {
        updateModelList(data.biases_info);
        console.log('File Information:', data.file_info);
        console.log('Bias Information:', data.biases_info);
    } else {
        console.error('Error:', data.message);
    }
}

function updateModelList(biasesInfo) {
    const models = Array.from(new Set(biasesInfo.map(item => item.model_name)));
    const modelList = $('.model-list');
    modelList.empty();

    models.forEach((model, index) => {
        const listItem = createModelItem(model, biasesInfo);
        modelList.append(listItem);
        if (index === 0) {
            listItem.click();
        }
    });
}

function createModelItem(model, biasesInfo) {
    const listItem = $('<li>').text(model).addClass('model-item');

    listItem.on('click', function () {
        const selectedModel = $(this).text();
        const biasesForModel = biasesInfo.filter(item => item.model_name === selectedModel);
        const biasesList = biasesForModel.map(bias => $('<li>').text(bias.bias_text).addClass('bias-item'));

        $('.bias-list').empty().append($('<ul>').append(biasesList));
        $(this).addClass('selected').siblings().removeClass('selected');
        $('.bias-list .bias-item:first-child').click();

        $('.bias-item').on('mouseenter', function () {
            $(this).addClass('hover');
        }).on('mouseleave', function () {
            $(this).removeClass('hover');
        }).on('click', function () {
            $(this).addClass('selected').siblings().removeClass('selected');
        });
    });

    listItem.hover(
        function () {
            $(this).addClass('hover');
        },
        function () {
            $(this).removeClass('hover');
        }
    );

    return listItem;
}

function handleError(error) {
    console.error('Error:', error);
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

function adjustPanel2Position(isCollapsed) {
    const panel2 = document.getElementById('panel2');
    const panel1Width = isCollapsed ? 50 : 400;

    panel2.style.right = `${panel1Width}px`;
}

document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = window.location.href;
    const fileName = extractFileNameFromUrl(currentUrl);
    fetchFileInfo(fileName);

    // Add event listeners for panel toggling and mouse enter/leave
    const panel1 = document.getElementById('panel1');
    const panel2 = document.getElementById('panel2');

    panel1.addEventListener('mouseenter', function() {
        togglePanel('panel1');
        adjustPanel2Position(false);
    });

    panel1.addEventListener('mouseleave', function() {
        togglePanel('panel1');
        adjustPanel2Position(true);
    });

    panel2.addEventListener('mouseenter', function() {
        togglePanel('panel2');
    });

    panel2.addEventListener('mouseleave', function() {
        togglePanel('panel2');
    });
});
