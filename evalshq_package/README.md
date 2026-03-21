# 🛡️ Evalshq: Generative AI Agent Evaluation Sandbox

[![PyPI version](https://badge.fury.io/py/evalshq.svg)](https://badge.fury.io/py/evalshq)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Evalshq** is an enterprise-grade Red Teaming and Evaluation framework for Generative AI Agents. It dynamically generates high-pressure, context-aware scenarios (The "Gauntlet") and evaluates your agent's decision-making using a simulated "Social Physics" engine and a Supreme Auditor.

Stop testing your AI on static benchmarks. Test it in reality.

## 🚀 Features
* **Scenario Factory:** Generates unique, n-act stress tests tailored to *any* industry context (e.g., "High-Stakes Law Firm", "Hospital ICU").
* **Social Physics Engine:** Simulates real-world consequences. If your agent makes a bad decision, team morale drops and legal risks spike.
* **Chaos Factor:** Adjust the difficulty from `0.0` (Peaceful) to `1.0` (Total System Collapse).
* **Supreme Auditor:** Grades your agent (A-F) on Ethics, Speed, and Safety, providing a detailed rationale.
* **Multi-Provider Support:** Works natively with OpenAI (`gpt-4o`) and Google Gemini (`gemini-2.5-flash`).

## 📦 Installation
```bash
pip install evalshq