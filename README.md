# Chatbot de IA

Este es un proyecto de chatbot de IA que utiliza la API de Mistral para generar respuestas. El chatbot está integrado en una página web básica utilizando HTML, CSS, y JavaScript, y el backend está desarrollado con Flask en Python.

## Estructura del Proyecto

wsdev_chatbot/
├── app.py
├── requirements.txt
├── .env
├── static/
│ ├── css/
│ │ └── styles.css
│ ├── js/
│ │ └── script.js
├── templates/
│ └── index.html
└── README.md

## Requisitos

- Python 3.x
- Flask
- Mistral API Key

## Instalación

1. Clonar este repositorio:

   ```bash
   git clone https://github.com/WnSg/Chatbot-IA.git
   cd wsdev_chatbot/
   ```

2. Crear y activar un entorno virtual

```bash
python -m venv venv
source venv/Scripts/activate  # En Windows
source venv/bin/activate      # En macOS/Linux
```

3. Instalar las dependencias

```bash
pip install -r requirements.txt
```

4. Crear un archivo .env en el directorio raíz del proyecto y agrega tu API key de Mistral:

MISTRAL_API_KEY=your_mistral_api_key_here

## Ejecución

1. Ejecutar el servidor Flask

```bash
python app.py
```

2. Abre el navegador web y navega a http://127.0.0.1:5000/.

## Uso

- Escribe un mensaje en el campo de entrada y haz clic en el botón "Send".
- El chatbot procesará tu mensaje y mostrará la respuesta en el área de chat.
  -Los bloques de código en las respuestas se resaltarán y tendrán un botón de copiar para facilitar su uso.

## Archivos Principales

**app.py**

Este archivo contiene el backend del proyecto, desarrollado con Flask. Se encarga de manejar las solicitudes del chatbot y comunicarse con la API de Mistral.

```python
from flask import Flask, render_template, request, jsonify
from mistralai import Mistral
from dotenv import load_dotenv
import os

# Cargar variables de entorno desde el archivo .env
load_dotenv()

app = Flask(__name__)

# Obtener la API key de Mistral desde las variables de entorno
api_key = os.getenv('MISTRAL_API_KEY')
client = Mistral(api_key=api_key)
agent_id = "ag:4711474b:20241119:untitled-agent:fcc7957e"
print(f"Mistral API Key: {api_key}")  # Verificar que la API key se cargue correctamente

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-response', methods=['POST'])
def get_response():
    user_message = request.json['message']
    print(f"User message: {user_message}")  # Verificar el mensaje del usuario
    try:
        chat_response = client.agents.complete(
            agent_id=agent_id,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )
        print(f"Mistral response: {chat_response}")  # Verificar la respuesta de Mistral
        return jsonify({'response': chat_response.choices[0].message.content.strip()})
    except Exception as e:
        error_message = str(e)
        print(f"Error: {error_message}")  # Imprimir cualquier error que ocurra
        return jsonify({'response': f"Error: {error_message}"})

if __name__ == '__main__':
    app.run(debug=True)
```

**requirements.txt**

Este archivo lista todas las dependencias del proyecto que se deben instalar.

```
Flask
python-dotenv
mistralai
```

**static/css/styles.css**

Este archivo contiene los estilos CSS para la página web del chatbot.

```css
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#chat-container {
  width: 400px;
  height: 600px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

header {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-align: center;
}

#chat-box {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  border-bottom: 1px solid #ccc;
}

#input-container {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
}

#user-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  resize: none;
  height: 60px;
}

#send-button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

#send-button:hover {
  background-color: #0056b3;
}

#loading {
  text-align: center;
  padding: 10px;
  color: #007bff;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.message.user {
  background-color: #e1ffc7;
  align-self: flex-end;
}

.message.bot {
  background-color: #f1f1f1;
  align-self: flex-start;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Estilos para el código resaltado */
.hljs {
  background: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

/* Estilos para el botón de copiar */
.copy-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-bottom: 10px;
}

.copy-button:hover {
  background-color: #0056b3;
}
```

**static/js/script.js**

Este archivo contiene la lógica JavaScript para manejar la entrada del usuario y mostrar las respuestas del chatbot.

```javascript
// Configurar marked.js para utilizar highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  },
});

document.getElementById("send-button").addEventListener("click", function () {
  const userInput = document.getElementById("user-input").value;
  if (userInput.trim() !== "") {
    addMessageToChatBox("user", userInput);
    document.getElementById("loading").style.display = "block"; // Mostrar indicador de carga
    fetch("/get-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    })
      .then((response) => response.json())
      .then((data) => {
        addMessageToChatBox("bot", data.response);
        document.getElementById("loading").style.display = "none"; // Ocultar indicador de carga
      });
    document.getElementById("user-input").value = "";
  }
});

function addMessageToChatBox(sender, message) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.innerHTML = marked.parse(message); // Utiliza marked.parse() para convertir Markdown a HTML
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Agregar botón de copiar al código
  const codeBlocks = messageElement.querySelectorAll("pre code");
  codeBlocks.forEach((block) => {
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.className = "copy-button";
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(block.innerText).then(() => {
        copyButton.textContent = "Copied!";
        setTimeout(() => {
          copyButton.textContent = "Copy";
        }, 2000);
      });
    });
    block.parentNode.insertBefore(copyButton, block);
  });
}
```

**templates/index.html**
Este archivo contiene la estructura HTML de la página web del chatbot.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chatbot</title>
    <link
      rel="stylesheet"
      href="{{ url_for('static', filename='css/styles.css') }}"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/default.min.css"
    />
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script>
  </head>
  <body>
    <div id="chat-container">
      <header>
        <h1>Chatbot de IA</h1>
      </header>
      <div id="chat-box"></div>
      <div id="input-container">
        <textarea id="user-input" placeholder="Type a message..."></textarea>
        <button id="send-button">Send</button>
      </div>
      <div id="loading" style="display: none;">Loading...</div>
    </div>
    <script src="{{ url_for('static', filename='js/script.js') }}"></script>
  </body>
</html>
```

# Documentacion de Prompts

![texto alternativo](https://drive.google.com/file/d/1uTMMPWPR_s2pm9nC_-0y7ESc3UwgLpuz/view?usp=sharing)
