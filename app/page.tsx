"use client";

import { useState, useEffect, useRef } from "react";
import { runDynamicAudit, generateSchemaFromText } from "../actions";

interface AuditResult {
  testName: string;
  prompt: string;
  reasoning: string;
  output: string;
  breached: boolean;
  analysis: string;
}

export default function AuditDashboard() {
  const [apiKey, setApiKey] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [importText, setImportText] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [systemPrompt, setSystemPrompt] = useState("You are a helpful customer support agent. You can help users book flights.");
  
  const [toolsJson, setToolsJson] = useState(JSON.stringify({
    type: "function",
    function: {
      name: "book_flight",
      description: "Books a flight for the user.",
      parameters: {
        type: "object",
        properties: {
          destination: { type: "string", description: "The city the user is flying to" },
          date: { type: "string", description: "The date of the flight in YYYY-MM-DD format" }
        },
        required: ["destination", "date"]
      }
    }
  }, null, 2));

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const handleGenerateSchema = async () => {
    if (!apiKey.trim() || !importText.trim()) return;
    setIsGenerating(true);
    try {
      const generatedJson = await generateSchemaFromText(importText, apiKey);
      setToolsJson(JSON.stringify(JSON.parse(generatedJson), null, 2));
      setImportText("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const startAudit = async () => {
    if (!apiKey.trim()) {
      alert("Please enter your OpenAI API Key first.");
      return;
    }
    if (isRunning) return;
    setIsRunning(true);
    
    setLogs([
      "Loading Agent into Simulation Environment...",
      "Parsing Agent Capabilities (JSON)...",
      "Injecting Cognitive Tracing Hooks...",
      "Generating Real-World Track Conditions...",
      "--------------------------------------------------",
    ]);

    try {
      const results: AuditResult[] = await runDynamicAudit(systemPrompt, toolsJson, apiKey);
      
      let delay = 0;

      results.forEach((res) => {
        delay += 500;
        setTimeout(() => setLogs(prev => [...prev, ` `, `Running Lap: ${res.testName}`]), delay);
        
        delay += 1000;
        setTimeout(() => setLogs(prev => [...prev, `Simulated User: "${res.prompt}"`]), delay);
        
        delay += 1500;
        setTimeout(() => setLogs(prev => [...prev, `🧠 Cognitive Trace Extract: "${res.reasoning.substring(0, 180)}..."`]), delay);
        
        delay += 1500;
        setTimeout(() => setLogs(prev => [...prev, `⚡ Agent Final Action: ${res.output}`]), delay);
        
        delay += 1000;
        setTimeout(() => {
          if (res.breached) {
            setLogs(prev => [...prev, `Result: ❌ CRASHED (Logic Failure)`, `Auditor Telemetry: ${res.analysis}`]);
          } else {
            setLogs(prev => [...prev, `Result: ✅ PASSED (Logically Sound)`, `Auditor Telemetry: ${res.analysis}`]);
          }
        }, delay);
      });

      delay += 1000;
      setTimeout(() => {
        const breaches = results.filter(r => r.breached).length;
        const score = Math.round(((results.length - breaches) / results.length) * 100);
        setLogs(prev => [
          ...prev,
          ` `,
          `--------------------------------------------------`,
          `Simulation Complete.`,
          `Total Scenarios: ${results.length} | Crashes Detected: ${breaches}`,
          `Deployment Readiness Score: ${score}%`,
          `Ready for next iteration.`
        ]);
        setIsRunning(false);
      }, delay);

    } catch (err: any) {
      setLogs(prev => [...prev, `System Error: ${err.message}`]);
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d4] font-mono p-4 sm:p-8 text-sm leading-relaxed flex flex-col antialiased">
      
      {/* HEADER WITH OPENAI TRUST BADGE */}
      <div className="flex justify-between items-center text-neutral-500 mb-6 border-b border-neutral-800 pb-4 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
          <span className="font-bold tracking-widest uppercase text-white drop-shadow-md">EvalsHQ</span>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <span className="text-xs uppercase tracking-widest text-neutral-500 hidden sm:inline">Cognitive F1 Simulator</span>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-neutral-600">API Key:</span>
            <input 
              type="password" 
              placeholder="sk-proj-..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-black border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-300 focus:outline-none focus:border-neutral-500 w-48 transition-all"
            />
          </div>
          <div className="flex items-center gap-1 pr-1 opacity-70">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Supported by OpenAI</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 h-full mx-auto">
        
        {/* LEFT COLUMN: THE BUILDER */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">1. Agent Brain (System Prompt)</label>
            <textarea 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              disabled={isRunning || isGenerating}
              className="w-full h-24 bg-[#111] border border-neutral-800 rounded p-3 text-neutral-300 focus:outline-none focus:border-neutral-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-2 border-t border-neutral-800 pt-4">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex justify-between">
              <span>2. Agent Tools</span>
              <span className="text-yellow-500/80">Magic Importer</span>
            </label>
            
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Describe tool (e.g. 'Books a flight...')"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                disabled={isRunning || isGenerating || !apiKey.trim()}
                className="flex-1 bg-black border border-neutral-800 rounded p-2 text-neutral-300 text-xs focus:outline-none focus:border-neutral-500"
              />
              <button 
                onClick={handleGenerateSchema}
                disabled={isRunning || isGenerating || !importText.trim() || !apiKey.trim()}
                className="px-4 border border-neutral-700 rounded text-xs hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-neutral-500"
              >
                {isGenerating ? "Building..." : "Auto-Generate"}
              </button>
            </div>

            <textarea 
              value={toolsJson}
              onChange={(e) => setToolsJson(e.target.value)}
              disabled={isRunning || isGenerating}
              className="w-full h-56 bg-[#111] border border-neutral-800 rounded p-3 text-neutral-400 focus:outline-none focus:border-neutral-500 resize-none font-mono text-[10px]"
            />
          </div>

          <button 
            onClick={startAudit}
            disabled={isRunning || isGenerating || !apiKey.trim()}
            className={`w-full py-3 border rounded font-bold uppercase tracking-widest transition-colors mt-2 ${!isRunning && !isGenerating && apiKey.trim() ? 'border-neutral-500 bg-white text-black hover:bg-neutral-200 cursor-pointer' : 'border-neutral-800 bg-transparent text-neutral-600 cursor-not-allowed'}`}
          >
            {isRunning ? "Running Simulation..." : "Run Pre-Deployment Test"}
          </button>
          {!apiKey.trim() && <span className="text-[10px] text-red-500 text-center mt-1">Requires OpenAI API Key to run</span>}
        </div>

        {/* RIGHT COLUMN: THE TERMINAL */}
        <div className="w-full lg:w-7/12 bg-black border border-neutral-900 rounded p-6 flex flex-col">
          <span className="text-xs text-neutral-600 mb-4 uppercase tracking-widest border-b border-neutral-900 pb-2">Live Telemetry Logs</span>
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 scrollbar-hide min-h-[500px]">
            {logs.length === 0 && <span className="text-neutral-700 italic">Engine idle. Waiting for deployment...</span>}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4">
                <span className={
                  log.includes('❌ CRASHED') ? 'text-red-400 font-bold' : 
                  log.includes('✅ PASSED') ? 'text-green-400 font-bold' : 
                  log.includes('Auditor Telemetry:') ? 'text-yellow-200/80 italic' : 
                  log.includes('🧠 Cognitive Trace') ? 'text-purple-400 italic' : 
                  log.includes('Simulated User:') ? 'text-neutral-400 italic' :
                  log.includes('EvalsHQ') ? 'text-white font-bold' :
                  'text-neutral-300'
                }>
                  {log}
                </span>
              </div>
            ))}
            {isRunning && <span className="inline-block w-2 h-4 bg-neutral-400 animate-pulse mt-2" />}
          </div>
        </div>

      </div>
    </div>
  );
}