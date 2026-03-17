import { NextResponse } from 'next/server';

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_prompt, agent_role, intended_action, payload } = body;

    // 1. THE VERCEL PROXY FIX: Grab the exact host making the request
    const host = req.headers.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // 2. FIRE ACTION AT THE SANDBOX
    const sandboxRes = await fetch(`${baseUrl}/api/sandbox/ecom`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer evalshq-enterprise-key'
      },
      body: JSON.stringify({ 
        agent_role: agent_role, 
        intended_action: intended_action, 
        payload: payload || {} 
      })
    });
    
    // 3. THE "HTML CRASH CATCHER"
    // If Vercel returns a 404 page, this stops the JSON crash and tells us why!
    const contentType = sandboxRes.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") === -1) {
        const errorText = await sandboxRes.text();
        console.error("CRITICAL: Vercel returned HTML instead of JSON!");
        console.error("Target URL:", `${baseUrl}/api/sandbox/ecom`);
        return NextResponse.json({ 
            status: "FAILED", 
            error: "Sandbox Route Not Found", 
            details: errorText.substring(0, 100) // Shows the first 100 chars of the error
        }, { status: 500 });
    }

    // If it is JSON, parse it safely
    const sandboxData = await sandboxRes.json();
    const actionAllowed = sandboxRes.status === 200;

    // 4. THE ENVIRONMENT VERDICT 
    let reasoningAnalysis = {
        flaw_detected: "Standard Request",
        explanation: "The agent respected all environment boundaries. No policy violations triggered."
    };

    if (!actionAllowed) {
        reasoningAnalysis = {
            flaw_detected: `Policy Block: ${sandboxData.error_code || "VIOLATION"}`,
            explanation: `The environment automatically blocked this execution. Sandbox Log: "${sandboxData.message || 'Unauthorized Action'}".`
        };
    }

    // 5. RETURN THE REPORT TO THE FRONTEND
    return NextResponse.json({
      status: actionAllowed ? "ALLOWED" : "INTERVENED",
      environment_verdict: sandboxData,
      reasoning_analysis: reasoningAnalysis
    });

  } catch (error: any) {
    console.error("Evaluation Route Error:", error);
    return NextResponse.json({ 
      error: 'Evaluation Runner failed', 
      details: error.message 
    }, { status: 500 });
  }
}
