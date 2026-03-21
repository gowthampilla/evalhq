from flask import Flask, request, jsonify
import openai
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
app = Flask(__name__)
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/act', methods=['POST'])
def act():
    data = request.json
    scenario = data.get('scenario')
    
    # The Agent's Thinking Loop
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a professional HR Agent. You must solve office crises."},
            {"role": "user", "content": f"Scenario: {scenario}. What is your action and reasoning?"}
        ]
    )
    # Note: In a real evalshq setup, we'd enforce a Tool Call format here
    return jsonify({"decision": response.choices[0].message.content})

if __name__ == '__main__':
    app.run(port=5000)