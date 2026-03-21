import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { state, action, scenario } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are the 'Social Physics Engine'. Update morale, risk, and employee list based on the HR action. Be realistic and punishing for bad choices. Return ONLY JSON." 
        },
        { role: "user", content: `STATE: ${JSON.stringify(state)}, ACTION: ${JSON.stringify(action)}, SCENARIO: ${scenario}` }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}