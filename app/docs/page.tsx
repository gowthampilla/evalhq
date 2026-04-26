import React from 'react';

// --- TYPES ---
interface DocSectionProps {
  title: string;
  id: string;
  children: React.ReactNode;
}

interface CalloutProps {
  type: 'note' | 'warning' | 'success';
  title: string;
  children: React.ReactNode;
}

// --- COMPONENTS ---
const NavLink = ({ label, href }: { label: string; href: string }) => (
  <a 
    href={href} 
    className="block py-1.5 text-zinc-500 hover:text-zinc-200 transition-colors text-[13px] border-l border-zinc-800 pl-4 -ml-px hover:border-zinc-400"
  >
    {label}
  </a>
);

const DocSection: React.FC<DocSectionProps> = ({ title, id, children }) => (
  <section id={id} className="py-12 border-b border-zinc-900 last:border-0">
    <h2 className="text-white text-2xl font-semibold tracking-tight mb-6">{title}</h2>
    <div className="text-zinc-400 leading-relaxed space-y-4 text-[15px]">
      {children}
    </div>
  </section>
);

const Callout: React.FC<CalloutProps> = ({ type, title, children }) => {
  const styles = {
    note: "border-zinc-800 bg-zinc-900/50 text-zinc-300",
    warning: "border-amber-900/30 bg-amber-900/10 text-amber-200/80",
    success: "border-emerald-900/30 bg-emerald-900/10 text-emerald-200/80"
  };
  return (
    <div className={`p-4 border rounded-lg my-6 ${styles[type]}`}>
      <div className="text-[11px] font-bold uppercase tracking-widest mb-1 opacity-80">{title}</div>
      <div className="text-[13px] leading-relaxed">{children}</div>
    </div>
  );
};

export default function EvalshqProductDocs() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-zinc-700 selection:text-white">
      
      {/* 1. TOP NAVIGATIONBAR */}
      <header className="h-14 border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <span className="text-white font-bold tracking-tighter text-lg uppercase">Evalshq</span>
          <span className="text-zinc-600 text-xs font-mono">v1.0.4</span>
        </div>
        <div className="flex items-center gap-4 text-[13px] font-medium text-zinc-400">
          <span className="text-emerald-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            API Stable
          </span>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto flex relative">
        
        {/* 2. SIDEBAR NAVIGATION */}
        <aside className="hidden lg:block w-64 h-[calc(100vh-3.5rem)] sticky top-14 p-8 overflow-y-auto border-r border-zinc-900">
          <nav className="space-y-8">
            <div>
              <h4 className="text-white text-[11px] font-bold uppercase tracking-widest mb-4">Core Concepts</h4>
              <div className="space-y-1">
                <NavLink label="The Nerion Philosophy" href="#philosophy" />
                <NavLink label="How it Works" href="#how-it-works" />
                <NavLink label="Mechanical Protocol" href="#protocol" />
              </div>
            </div>
            <div>
              <h4 className="text-white text-[11px] font-bold uppercase tracking-widest mb-4">API Specification</h4>
              <div className="space-y-1">
                <NavLink label="Authentication" href="#auth" />
                <NavLink label="Evaluate Endpoint" href="#api-ref" />
                <NavLink label="Response Forensics" href="#schema" />
              </div>
            </div>
            <div>
              <h4 className="text-white text-[11px] font-bold uppercase tracking-widest mb-4">Operations</h4>
              <div className="space-y-1">
                <NavLink label="Requirements" href="#reqs" />
                <NavLink label="Self-Hosting" href="#hosting" />
              </div>
            </div>
          </nav>
        </aside>

        {/* 3. MAIN CONTENT CANVAS */}
        <main className="flex-1 max-w-4xl px-6 md:px-16 py-12">
          
          {/* INTRO HERO */}
          <div className="mb-16 border-b border-zinc-900 pb-16">
            <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-6">Nerion Decision Infrastructure</h1>
            <p className="text-xl text-zinc-500 font-light leading-relaxed">
              Evalshq provides a deterministic pre-execution risk layer for autonomous agents. We mathematically prove the blast radius of AI actions before they commit to production kernels.
            </p>
          </div>

          {/* PHILOSOPHY */}
          <DocSection title="The Nerion Philosophy" id="philosophy">
            <p>
              Autonomous agents are increasingly granted write-access to databases, shells, and critical APIs. However, agents are non-deterministic; they hallucinate. In an agentic workflow, a hallucination is not a text error—it is an <strong>infrastructure mutation</strong>.
            </p>
            <p>
              Evalshq functions as a <strong>Digital Supreme Court</strong>. Instead of trusting an agent's internal logic, we force the agent to submit its proposed actions to an isolated, adversarial environment where state changes are monitored, logged, and audited in real-time.
            </p>
            <Callout type="note" title="Zero-Trust Agency">
              We operate on the premise that intent and impact are separate audited dimensions. A semantically correct command can still be infrastructurally destructive.
            </Callout>
          </DocSection>

          {/* HOW IT WORKS */}
          <DocSection title="Mechanical Lifecycle" id="how-it-works">
            <p>Every transaction routed through the Nerion Engine follows a strict 5-phase deterministic protocol:</p>
            <div className="mt-8 space-y-8">
              {[
                { step: "01", t: "Intercept", d: "The gateway catches the tool-call (SQL/Shell) and suspends execution. No state mutation has occurred in production." },
                { step: "02", t: "State Forking", d: "Nerion creates an ephemeral fork of production paths inside a sterile Linux Micro-VM in <26ms." },
                { step: "03", t: "Detonation", d: "The payload executes inside the sandbox. We perform adversarial intent auditing using BYOK credentials." },
                { step: "04", t: "Forensic Diff", d: "Recursive checksums compare environment state before/after execution to detect unauthorized mutations or exfiltration." },
                { step: "05", t: "Verdict", d: "The engine issues an ALLOW signal to commit, or a BLOCK verdict with a detailed forensic report." }
              ].map((phase, i) => (
                <div key={i} className="flex gap-6">
                  <span className="text-zinc-700 font-mono font-bold">{phase.step}</span>
                  <div className="space-y-1">
                    <div className="text-white font-semibold">{phase.t}</div>
                    <div className="text-zinc-500 text-sm leading-relaxed">{phase.d}</div>
                  </div>
                </div>
              ))}
            </div>
            
          </DocSection>

          {/* API REFERENCE */}
          <DocSection title="API Specification" id="api-ref">
            <div className="space-y-4 mb-8">
               <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Post</span>
                  <code className="text-zinc-200 text-sm font-mono">https://nerionpro.onrender.com/api/v1/evaluate</code>
               </div>
               <p className="text-sm text-zinc-500">Evaluates the intent and impact of a proposed agentic action.</p>
            </div>

            <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden font-mono text-[13px]">
               <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 text-[11px] uppercase tracking-widest font-bold text-zinc-500">Python Integration</div>
               <div className="p-6 text-zinc-300 leading-relaxed whitespace-pre overflow-x-auto">
{`import requests
import os

def audit_intent(command):
    # Establish connection to the Pre-Execution Gateway
    API_URL = "https://nerionpro.onrender.com/api/v1/evaluate"
    
    payload = {
        "payload": command,
        "isolation": True,
        "context_files": ["/app/db/prod.sql"],
        "user_api_key": os.getenv("OPENAI_API_KEY") # BYOK
    }

    # Issue Forensic Detonation Request
    res = requests.post(API_URL, json=payload)
    verdict = res.json()

    if verdict["verdict"] == "BLOCK":
        # Halt execution and log forensic rationale
        raise SystemExit(f"NERION_HALT: {verdict['reason']}")
        
    return True # Safe to commit`}
               </div>
            </div>
          </DocSection>

          {/* RESPONSE SCHEMA */}
          <DocSection title="Response Forensics" id="schema">
            <p className="mb-6">The engine returns a comprehensive forensic object detailing the impact of the detonation.</p>
            <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden font-mono text-[13px]">
               <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 text-[11px] uppercase tracking-widest font-bold text-zinc-500">JSON Schema</div>
               <div className="p-6 text-zinc-400 leading-relaxed italic uppercase">
{`{
  "verdict": "BLOCK",
  "reason": "STATE_CORRUPTION_DETECTED",
  "audit_id": "nerion_audit_0x77a2",
  "forensics": {
    "files_modified": ["/app/db/prod.sql"],
    "entropy_delta": 0.84,
    "pii_leak": false
  }
}`}
               </div>
            </div>
          </DocSection>

          {/* REQUIREMENTS */}
          <DocSection title="System Requirements" id="reqs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div className="space-y-3">
                 <h4 className="text-white text-sm font-bold">Runtime Compatibility</h4>
                 <ul className="text-zinc-500 text-sm space-y-2 list-disc pl-4">
                    <li>Python 3.10+ (Recommended)</li>
                    <li>Node.js 20.x+</li>
                    <li>Go 1.21+</li>
                 </ul>
              </div>
              <div className="space-y-3">
                 <h4 className="text-white text-sm font-bold">Authentication Infrastructure</h4>
                 <ul className="text-zinc-500 text-sm space-y-2 list-disc pl-4">
                    <li>Nerion Organization API Key</li>
                    <li>OpenAI / Anthropic Keys (BYOK Model)</li>
                 </ul>
              </div>
            </div>
          </DocSection>

          {/* FOOTER */}
          <footer className="mt-32 pt-12 border-t border-zinc-900 text-zinc-600 text-[11px] uppercase tracking-[0.4em] font-bold">
            Evalshq // Decision Infrastructure // Bangalore // 2026
          </footer>
        </main>

        {/* 4. ON THIS PAGE SIDEBAR */}
        <aside className="hidden xl:block w-64 h-[calc(100vh-3.5rem)] sticky top-14 p-8 overflow-y-auto">
          <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-4">On this page</h4>
          <nav className="space-y-3 text-[12px] text-zinc-500 font-medium">
             <a href="#philosophy" className="block hover:text-zinc-200">Philosophy</a>
             <a href="#how-it-works" className="block hover:text-zinc-200">How it Works</a>
             <a href="#api-ref" className="block hover:text-zinc-200">API Reference</a>
             <a href="#schema" className="block hover:text-zinc-200">Forensics</a>
             <a href="#reqs" className="block hover:text-zinc-200">Requirements</a>
          </nav>
        </aside>

      </div>
    </div>
  );
}
