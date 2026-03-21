import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { world_state, act_scenario, agent_response } = await req.json();

    // THE "THINKING PHYSICS" PROMPT
    const worldBrain = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are the 'Social Physics Engine' of a corporate office. 
          Your job is to update the 'World State' based on an HR Agent's action.
          Do NOT use fixed numbers. Reason like a social psychologist.
          If the action is weak, Morale should drop significantly.
          If the action is illegal, Risk should spike.
          Return ONLY a JSON object with updated: morale, risk, and a list of current employees.` 
        },
        { 
          role: "user", 
          content: `PREVIOUS STATE: ${JSON.stringify(world_state)}
                    CURRENT CRISIS: ${act_scenario}
                    AGENT'S ACTION: ${JSON.stringify(agent_response)}
                    
                    Update the state. Explain nothing, just return JSON.` 
        }
      ],
      response_format: { type: "json_object" }
    });

    const newState = JSON.parse(worldBrain.choices[0].message.content || "{}");
    return NextResponse.json({ state: newState });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}