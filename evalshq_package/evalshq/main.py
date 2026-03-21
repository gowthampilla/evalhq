import requests
from .core.base import BaseAgent
from .core.engine import EvalEngine

class HttpAgent(BaseAgent):
    def __init__(self, url):
        self.url = url
        
    def get_decision(self, scenario: str) -> dict:
        try:
            return requests.post(self.url, json={"scenario": scenario}).json()
        except requests.exceptions.ConnectionError:
            print(f"❌ ERROR: Could not connect to agent at {self.url}. Is your server running?")
            exit(1)

def run(agent_url, api_key, provider="openai", context="General Office", chaos_factor=0.5):
    """Evalshq v1.0 Entry Point"""
    agent = HttpAgent(agent_url)
    engine = EvalEngine(agent, api_key, provider, context, chaos_factor)
    return engine.run_eval()