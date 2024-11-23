// Configurar marked.js para utilizar highlight.js
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        } else {
            return hljs.highlightAuto(code).value;
        }
    }
});

document.getElementById('send-button').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== "") {
        addMessageToChatBox('user', userInput);
        document.getElementById('loading').style.display = 'block';  // Mostrar indicador de carga
        fetch('/get-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => response.json())
        .then(data => {
            addMessageToChatBox('bot', data.response);
            document.getElementById('loading').style.display = 'none';  // Ocultar indicador de carga
        });
        document.getElementById('user-input').value = '';
    }
});

function addMessageToChatBox(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = marked.parse(message);  // Utiliza marked.parse() para convertir Markdown a HTML
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Agregar botón de copiar al código
    const codeBlocks = messageElement.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.className = 'copy-button';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(block.innerText).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            });
        });
        block.parentNode.insertBefore(copyButton, block);
    });
}