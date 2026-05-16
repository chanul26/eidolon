import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { data } = await req.json()
  const dataContext = JSON.stringify(data, null, 2)
  
  const detection = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a data forensics expert. Analyze the provided data and identify any anomalies, errors, or suspicious entries. Respond in JSON with: { "hasAnomaly": boolean, "severity": "none"|"warning"|"critical", "summary": string, "anomalyDetails": string }'
      },
      { role: 'user', content: `Analyze this data:\n${dataContext}` }
    ],
    response_format: { type: 'json_object' }
  })
  
  const analysis = JSON.parse(detection.choices[0].message.content!)
  
  return NextResponse.json({
    hasAnomaly: analysis.hasAnomaly,
    severity: analysis.severity,
    summary: analysis.summary,
    details: analysis.anomalyDetails
  })
}