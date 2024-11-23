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