import sys
import os

# 🚨 THE OVERRIDE HACK: Force Python to use the new folder, ignoring the ghost!
current_dir = os.path.dirname(os.path.abspath(__file__))
package_dir = os.path.join(current_dir, 'evalshq_package')
sys.path.insert(0, package_dir)

import evalshq
from dotenv import load_dotenv

# Let's prove we killed the ghost. This will print the exact file it uses:
print("🎯 GHOST TRACKER: Using code from ->", evalshq.__file__)

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