let fileInfo = {};

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
        fileInfo = data.biases_info;
        updateModelList();
        handleAgreement(fileInfo[0]?.audit_response);
        handleReasoning(fileInfo[0]?.reasoning);
    } else {
        handleError(data);
    }
}

function handleReasoning(reasoning) {
    const reasoningTextArea = document.getElementById('why-whynot-box');
    reasoningTextArea.value = reasoning;
}

function updateAuditResponse(isAgree) {
    const selectedInfo = getSelectedInfo();
    const selectedBias = selectedInfo.selectedBias;

    // Find the corresponding bias in fileInfo and update audit_response
    const updatedFileInfo = fileInfo.map(item => {
        if (item.model_name === selectedInfo.selectedModel && item.bias_text === selectedBias) {
            if (isAgree !== null) {
                item.audit_response = isAgree;
            }
        }
        return item;
    });

    fileInfo = updatedFileInfo;

    if (isAgree !== null) {
        handleAgreement(isAgree);
    }
}

function updateReasoning(reasoning) {
    const selectedInfo = getSelectedInfo();
    const selectedBias = selectedInfo.selectedBias;

    // Find the corresponding bias in fileInfo and update reasoning
    const updatedFileInfo = fileInfo.map(item => {
        if (item.model_name === selectedInfo.selectedModel && item.bias_text === selectedBias) {
            if (reasoning !== null) {
                item.reasoning = reasoning;
            }
        }
        return item;
    });

    fileInfo = updatedFileInfo;

    // Only update the view if reasoning is not null
    if (reasoning !== null) {
        handleReasoning(reasoning);
    }
}

function handleModelSelection(selectedModel) {
    const biasesForModel = fileInfo.filter(item => item.model_name === selectedModel);
    const selectedBiasItem = biasesForModel[0];

    handleAgreement(selectedBiasItem.audit_response);
    handleReasoning(selectedBiasItem.reasoning);
}

function updateModelList() {
    const models = Array.from(new Set(fileInfo.map(item => item.model_name)));
    const modelList = $('.model-list');
    modelList.empty();

    models.forEach((model, index) => {
        const listItem = createModelItem(model);
        modelList.append(listItem);
        if (index === 0) {
            listItem.click();
            handleModelSelection(model); // Added to handle initial model selection
        }
        $('.bias-item:first-child').click();
    });
}

function createModelItem(model) {
    const listItem = $('<li>').text(model).addClass('model-item');

    listItem.on('click', function () {
        const selectedIndex = $(this).index();
        const selectedModel = $(this).text();
        const biasesForModel = fileInfo.filter(item => item.model_name === selectedModel);
        const biasesList = biasesForModel.map(bias => $('<li>').text(bias.bias_text).addClass('bias-item'));

        $('.bias-list').empty().append($('<ul>').append(biasesList));
        $(this).addClass('selected').siblings().removeClass('selected');
        $('.bias-list .bias-item:first-child').click();

        const selectedBias = biasesForModel[0];
        handleAgreement(selectedBias.audit_response);

        $('.bias-item').on('mouseenter', function () {
            $(this).addClass('hover');
        }).on('mouseleave', function () {
            $(this).removeClass('hover');
        }).on('click', function () {
            $(this).addClass('selected').siblings().removeClass('selected');

            const selectedBiasText = $(this).text();
            const selectedModelName = $('.model-item.selected').text();
            const selectedBiasItem = fileInfo.find(item => item.model_name === selectedModelName && item.bias_text === selectedBiasText);
            handleAgreement(selectedBiasItem.audit_response);
            clearAndLoadReasoning(selectedBiasItem.reasoning);
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

function previousBias(event) {
    const selectedModel = $('.model-item.selected').text();
    const selectedBias = $('.bias-item.selected');

    if (selectedBias.length > 0 && selectedBias.index() > 0) {
        selectedBias.prev().click();
    } else {
        const previousModel = $('.model-item.selected').prev('.model-item');

        if (previousModel.length > 0) {
            const biasesForModel = fileInfo.filter(item => item.model_name === previousModel.text());
            const lastBias = biasesForModel[biasesForModel.length - 1];
            $('.model-item.selected').removeClass('selected');
            previousModel.click();
            $('.bias-item:contains("' + lastBias.bias_text + '")').click();
        } else {
            alert('No more models available in the previous direction. Please select a different file to proceed.');
        }
    }
}

function nextBias(event) {
    const selectedModel = $('.model-item.selected').text();
    const selectedBias = $('.bias-item.selected');

    if (selectedBias.length > 0 && selectedBias.next('.bias-item').length > 0) {
        selectedBias.next().click();
    } else {
        const nextModel = $('.model-item.selected').next('.model-item');
        if (nextModel.length > 0) {
            const biasesForModel = fileInfo.filter(item => item.model_name === nextModel.text());
            const firstBias = biasesForModel[0];
            $('.model-item.selected').removeClass('selected');
            nextModel.click();
            $('.bias-item:contains("' + firstBias.bias_text + '")').click();
        } else {
            alert('No more models available in the next direction. Please select a different file to proceed.');
        }
    }
}

function clearAndLoadReasoning(text) {
    const reasoningTextArea = document.getElementById('why-whynot-box');
    reasoningTextArea.value = text;
}

function handleError(error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
    openFileNav();
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

function handleAgreement(isAgree) {
    const agreeBtn = document.getElementById('agree-btn');
    const disagreeBtn = document.getElementById('disagree-btn');

    if (isAgree) {
        agreeBtn.style.backgroundColor = '#5CED73';
        disagreeBtn.style.backgroundColor = 'white';
    } else {
        disagreeBtn.style.backgroundColor = '#FF4F4B';
        agreeBtn.style.backgroundColor = 'white';
    }
}

function determineClickedButton() {
    const agreeBtn = window.getComputedStyle(document.getElementById('agree-btn'));
    const disagreeBtn = window.getComputedStyle(document.getElementById('disagree-btn'));

    if (agreeBtn.backgroundColor === 'rgb(92, 237, 115)') {
        return true;
    } else if (disagreeBtn.backgroundColor === 'rgb(255, 79, 75)') {
        return false;
    } else {
        return null;
    }
}

function getSelectedInfo() {
    const selectedModel = $('.model-list .selected').text();
    const selectedBias = $('.bias-list .selected').text();

    return {
        selectedModel: selectedModel,
        selectedBias: selectedBias
    };
}

function getTextAreaValue() {
    const textArea = document.getElementById('why-whynot-box').value;
    return textArea
}

document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = window.location.href;
    const fileName = extractFileNameFromUrl(currentUrl);
    fetchFileInfo(fileName);

    // event listeners for panel toggling and mouse enter/leave
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

    // event listeners for agree / disagree switch
    const agreeBtn = document.getElementById('agree-btn');
    const disagreeBtn = document.getElementById('disagree-btn');

    agreeBtn.addEventListener('click', function() {
        handleAgreement(true);
        updateAuditResponse(true);
    });

    disagreeBtn.addEventListener('click', function() {
        handleAgreement(false);
        updateAuditResponse(false);
    });

    const reasoningTextArea = document.getElementById('why-whynot-box');
    reasoningTextArea.addEventListener('input', function () {
        updateReasoning(getTextAreaValue());
    });

    // save progress every 5 seconds
    setInterval(function() {
        const isAgree = determineClickedButton();
        const selectedInfo = getSelectedInfo();
        const textAreaValue = getTextAreaValue();

        if (selectedInfo.selectedBias) {
            const formData = new FormData();
            formData.append('selected_model', selectedInfo.selectedModel);
            formData.append('selected_bias', selectedInfo.selectedBias);
            formData.append('audit_response', isAgree);
            formData.append('reasoning', textAreaValue);
            formData.append('file_name', extractFileNameFromUrl(window.location.href));

            fetch('/impart/saveProgress/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);

                    if (data.status === 'success') {
                        console.log('Progress saved successfully');
                    } else {
                        console.error('Error:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            console.log('No Bias Selected.');
        }
    }, 5000);
});

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

        if (data.status === 'success') {
            loadEditor(files[0].name);
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

}