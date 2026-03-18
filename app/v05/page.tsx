'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState, useEffect } from 'react';
import { MASTER_POOL } from './scenarios';

export default function AgentOpsDashboard() {
  const [activeScenarios, setActiveScenarios] = useState<any[]>([]);
  const [results, setResults] = useState<Record<number, any>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const [env, setEnv] = useState('🛒 E-Commerce Global');
  const [agentModel, setAgentModel] = useState('📦 E-Com Support Bot (v2.1)');

  const shuffleScenarios = () => {
    // @ts-ignore
    const shuffled = [...MASTER_POOL].sort(() => 0.5 - Math.random());
    
    // Sliced to exactly 15 scenarios for the demo
    const selected = shuffled.slice(0, 15).map((item, index) => ({
      ...item,
      id: index + 1
    }));
    
    setActiveScenarios(selected);
    setResults({});
    setProgress(0);
  };

  useEffect(() => {
    shuffleScenarios();
  }, []);

  // --- THE SPEED FIX: PARALLEL EXECUTION ---
  const runEvalSuite = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults({});

    let completedCount = 0;

    // This fires all 15 requests to Vercel at the exact same time
    await Promise.all(activeScenarios.map(async (scenario) => {
      try {
        const res = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_prompt: scenario.prompt,
            agent_role: scenario.role,
            intended_action: scenario.action,
            payload: scenario.payload,
            environment: env
          })
        });
        const data = await res.json();
        setResults(prev => ({ ...prev, [scenario.id]: data }));
      } catch (error) {
        setResults(prev => ({ ...prev, [scenario.id]: { error: "Eval Failed", status: "FAILED" } }));
      } finally {
        completedCount++;
        setProgress(completedCount);
      }
    }));

    setIsRunning(false);
  };

  const exportAuditReport = () => {
    const doc = new jsPDF();
    const total = activeScenarios.length;
    
    const passed = Object.values(results).filter(r => r?.status === 'PASSED').length;
    const failed = Object.values(results).filter(r => r?.status === 'FAILED' || r?.status === 'INTERVENED').length;
    
    const completed = passed + failed;
    const reliability = total > 0 ? ((completed / total) * 100).toFixed(1) : "0.0";
    const isSecure = parseFloat(reliability) > 85;

    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text("EvalsHQ: E-Com Agent Audit", 14, 22);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Target: ${env} | E-Com Agent: ${agentModel}`, 14, 35);

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Executive Performance Summary", 14, 48);

    const barX = 14;
    const barY = 55;
    const barWidth = 180;
    const barHeight = 8;
    doc.setFillColor(241, 245, 249);
    doc.rect(barX, barY, barWidth, barHeight, 'F');
    const progressWidth = (completed / total) * barWidth;
    doc.setFillColor(34, 197, 94);
    doc.rect(barX, barY, progressWidth, barHeight, 'F');

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Verified Valid: ${passed}`, barX, barY + 15);
    doc.text(`Policy Deviations Caught: ${failed}`, barX + 60, barY + 15);
    doc.text(`Total Coverage: ${total} Scenarios`, barX + 130, barY + 15);

    doc.setFontSize(18);
    doc.setTextColor(isSecure ? 34 : 197, isSecure ? 197 : 94, isSecure ? 94 : 34);
    doc.text(`Reliability Score: ${reliability}%`, 14, 82);
    
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(`SYSTEM STATUS: ${isSecure ? 'SECURE' : 'VULNERABILITIES DETECTED'}`, 14, 90);

    const tableData = activeScenarios.map(s => [
      s.id,
      s.type,
      s.prompt, 
      results[s.id]?.status || "PENDING",
      results[s.id]?.reasoning_analysis?.flaw_detected || "N/A"
    ]);

    autoTable(doc, {
      startY: 100,
      head: [['ID', 'Test Case', 'User Input', 'Verdict', 'Analysis']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], fontSize: 9, halign: 'center' },
      styles: { fontSize: 8, overflow: 'linebreak', cellWidth: 'wrap', cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 30 },
        2: { cellWidth: 70 },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 50 }
      },
      margin: { left: 14, right: 14 },
      pageBreak: 'auto'
    });

    doc.save(`EvalsHQ_Audit_EcomAgent.pdf`);
  };

  const totalScenarios = activeScenarios.length;
  const completedEvaluations = Object.keys(results).length;
  const interventionsCount = Object.values(results).filter(r => r?.status === 'FAILED' || r?.status === 'INTERVENED').length;
  const reliabilityScore = totalScenarios > 0 
    ? ((completedEvaluations / totalScenarios) * 100).toFixed(0) 
    : "0";

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic">Evals<span className="text-blue-600 not-italic">HQ</span></h1>
            <p className="text-slate-500 mt-1 text-xs uppercase tracking-[0.2em] font-bold">Automated Agent Testing & Audit Report</p>
          </div>
          <div className="flex gap-3">
            <button onClick={shuffleScenarios} disabled={isRunning} className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
              🔄 Refresh Batch
            </button>
            <button onClick={exportAuditReport} disabled={Object.keys(results).length === 0 || isRunning} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 disabled:opacity-50">
              📄 Export Audit PDF
            </button>
            <button onClick={runEvalSuite} disabled={isRunning || activeScenarios.length === 0} className="px-6 py-2 bg-black text-white rounded-md text-sm font-bold hover:bg-slate-800 shadow-lg disabled:opacity-50">
              {isRunning ? `SCANNING... (${progress}/${activeScenarios.length})` : 'START SECURITY SCAN'}
            </button>
          </div>
        </div>

        <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Environment</label>
            <select 
              value={env} 
              onChange={(e) => setEnv(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md p-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>🛒 E-Commerce Global</option>
              <option>🏦 Fintech / Banking</option>
              <option>🏥 Healthcare HIPAA</option>
            </select>
          </div>
          <div className="flex-1 border-l border-slate-200 pl-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active E-Com Agent</label>
            <select 
              value={agentModel}
              onChange={(e) => setAgentModel(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md p-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>📦 E-Com Support Bot (v2.1)</option>
              <option>🤖 Sales Closer Pro (v1.0)</option>
              <option>🛠️ Internal Ops Assistant</option>
              <option>🧪 Sandbox Test Agent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scenarios Loaded</p>
            <p className="text-4xl font-light mt-2">{totalScenarios}</p>
          </div>
          <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy Interventions</p>
            <p className="text-4xl font-light text-orange-600 mt-2">
              {interventionsCount}
            </p>
          </div>
          <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reliability Score</p>
            <p className="text-4xl font-light text-blue-600 mt-2">
               {reliabilityScore}%
            </p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xl max-h-[550px] overflow-y-auto">
          <table className="w-full text-left text-sm relative">
            <thead className="bg-slate-900 text-white sticky top-0">
              <tr>
                <th className="p-4 font-semibold uppercase text-[10px] tracking-wider">Test Case</th>
                <th className="p-4 font-semibold uppercase text-[10px] tracking-wider w-1/4">User Input</th>
                <th className="p-4 font-semibold uppercase text-[10px] tracking-wider">Verdict</th>
                <th className="p-4 font-semibold uppercase text-[10px] tracking-wider">Trace Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeScenarios.map((scenario) => {
                const res = results[scenario.id];
                const isPassed = res?.status === 'PASSED' || res?.status === 'ALLOWED';
                return (
                  <tr key={scenario.id} className="hover:bg-slate-50 transition-all">
                    <td className="p-4 font-bold text-slate-800">{scenario.type}</td>
                    <td className="p-4 text-slate-600 italic">"{scenario.prompt}"</td>
                    <td className="p-4">
                      {!res ? (
                         <span className="text-slate-300 animate-pulse text-[10px] font-bold">AWAITING...</span>
                      ) : isPassed ? (
                         <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200">PASSED</span>
                      ) : (
                         <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full border border-orange-200">INTERVENED</span>
                      )}
                    </td>
                    <td className="p-4 text-xs">
                      {res ? (
                        <div>
                           <span className="font-bold block text-slate-900">{res.reasoning_analysis?.flaw_detected || "Secure"}</span>
                           <span className="text-slate-500">{res.reasoning_analysis?.explanation}</span>
                        </div>
                      ) : "---"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
