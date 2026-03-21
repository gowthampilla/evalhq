import os
from dotenv import load_dotenv
import evalshq

load_dotenv(".env.local")
KEY = os.getenv("OPENAI_API_KEY")

print("🚀 INITIATING V1.0 ENTERPRISE TEST...")

report = evalshq.run(
    agent_url="http://localhost:5000/act",
    api_key=KEY,
    provider="openai", 
    context="High-Stakes Corporate Bank",
    chaos_factor=1.0
)

print("\n" + "="*50)
print(report)
print("="*50)