// app/api/evaluate/route.ts
import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const API_TOKEN = process.env.EVALS_API_TOKEN || 'evalshq-enterprise-key';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => {
      throw new Error('Invalid JSON body');
    });
    const { user_prompt, agent_role, intended_action, payload } = body;

    if (!agent_role || !intended_action) {
      return NextResponse.json(
        { error: 'Missing required fields: agent_role and intended_action' },
        { status: 400 }
      );
    }

    // Determine origin dynamically (works on localhost and Vercel)
    const origin = (() => {
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
      }
      return new URL(req.url).origin;
    })();

    const sandboxUrl = `${origin}/api/sandbox/ecom`;
    console.log(`[Evaluate] Calling sandbox at: ${sandboxUrl}`);

    // Call the internal sandbox endpoint
    const sandboxRes = await fetch(sandboxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        agent_role,
        intended_action,
        payload: payload || {},
      }),
    });

    // Safely parse the sandbox response
    let sandboxData;
    const contentType = sandboxRes.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      sandboxData = await sandboxRes.json();
    } else {
      const text = await sandboxRes.text();
      console.error('[Evaluate] Sandbox returned non-JSON:', text);
      throw new Error(`Sandbox returned status ${sandboxRes.status} with non-JSON response`);
    }

    // Determine if action was allowed (200) or blocked (403/422)
    const actionAllowed = sandboxRes.status === 200;

    // Build reasoning analysis
    const reasoningAnalysis = actionAllowed
      ? {
          flaw_detected: 'Standard Request',
          explanation:
            'The agent respected all environment boundaries. No policy violations triggered.',
        }
      : {
          flaw_detected: `Policy Block: ${sandboxData.error_code || 'VIOLATION'}`,
          explanation: `The environment automatically blocked this execution. Sandbox Log: "${
            sandboxData.message || 'Unauthorized Action'
          }".`,
        };

    // Prepare final response
    // - status: used by frontend to determine PASSED/FAILED (UI shows PASSED or INTERVENED accordingly)
    // - verdict: human-readable ALLOWED/INTERVENED (optional)
    // - success: boolean for easy checks
    const responsePayload = {
      status: actionAllowed ? 'PASSED' : 'FAILED',   // matches frontend expectations
      verdict: actionAllowed ? 'ALLOWED' : 'INTERVENED',
      success: actionAllowed,
      environment_verdict: sandboxData,
      reasoning_analysis: reasoningAnalysis,
    };

    console.log('[Evaluate] Final response:', responsePayload);

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error('[Evaluate] Fatal error:', error);
    return NextResponse.json(
      {
        error: 'Sandbox Evaluation failed to run',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
