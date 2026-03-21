import json
import os
import openai
from google import genai
from .base import BaseEvaluator

class EvalEngine(BaseEvaluator):
    def __init__(self, agent, api_key, provider="openai", context="General Office", chaos=0.5):
        self.agent = agent
        self.api_key = api_key
        self.provider = provider.lower()
        self.context = context
        self.chaos = chaos
        self.state = {"morale": 80, "risk": 5, "history": []}
        
        # Load the Data Registry dynamically
        current_dir = os.path.dirname(os.path.abspath(__file__))
        registry_path = os.path.join(current_dir, '..', 'registry', 'prompts.json')
        with open(registry_path, 'r') as f:
            self.prompts = json.load(f)

    def _call_ai(self, sys_prompt, user_prompt="", json_mode=False):
        if self.provider == "openai":
            client = openai.OpenAI(api_key=self.api_key)
            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": sys_prompt}, {"role": "user", "content": user_prompt}],
                response_format={"type": "json_object"} if json_mode else None
            )
            return res.choices[0].message.content
            
        elif self.provider == "gemini":
            client = genai.Client(api_key=self.api_key)
            if json_mode: sys_prompt += " Return ONLY valid JSON. No markdown."
            res = client.models.generate_content(
                model="gemini-2.5-flash", 
                contents=f"{sys_prompt}\n\n{user_prompt}"
            )
            return res.text.strip('```json').strip('```').strip()

    def run_eval(self):
        print(f"🏭 Evalshq Core: Booting '{self.context}' (Chaos Level: {self.chaos}) via {self.provider.upper()}...")
        
        factory_prompt = self.prompts["factory_system"].format(context=self.context)
        raw_acts = self._call_ai(factory_prompt, json_mode=True)
        try:
            acts = json.loads(raw_acts).get("acts", [])
        except json.JSONDecodeError:
            print("Factory failed to generate valid JSON.")
            return

        for act in acts:
            decision = self.agent.get_decision(act)
            world_sys = self.prompts["world_system"].format(
                context=self.context, chaos=self.chaos, state=self.state, act=act, action=decision
            )
            raw_new_state = self._call_ai(world_sys, json_mode=True)
            
            try:
                new_state = json.loads(raw_new_state)
                self.state.update(new_state)
            except json.JSONDecodeError:
                pass # Ignore malformed world updates

            self.state["history"].append({"act": act, "action": decision, "result": {"morale": self.state["morale"], "risk": self.state["risk"]}})
            print(f"Morale: {self.state.get('morale')} | Risk: {self.state.get('risk')}")

        print("Generating Supreme Audit Report...")
        audit_sys = self.prompts["auditor_system"].format(
            chaos=self.chaos, trace=json.dumps(self.state["history"])
        )
        return self._call_ai(audit_sys)