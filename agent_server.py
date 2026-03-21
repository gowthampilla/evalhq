from flask import Flask, request, jsonify
import openai
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
app = Flask(__name__)
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/act', methods=['POST'])
def act():
    scenario = request.json.get('scenario')
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an HR Director. Decisions: TERMINATE, WARNING, or IGNORE. Return JSON."},
            {"role": "user", "content": scenario}
        ],
        response_format={"type": "json_object"}
    )
    return jsonify(response.choices[0].message.content)

if __name__ == '__main__':
    print("🤖 Agent Server is running on port 5000...")
    app.run(port=5000)