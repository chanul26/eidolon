import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json()
    const dataContext = JSON.stringify(data, null, 2)
    
    const detection = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a data forensics expert. Analyze the provided data and identify any anomalies, errors, or suspicious entries. Respond strictly in JSON with: { "hasAnomaly": boolean, "severity": "none"|"warning"|"critical", "summary": string, "anomalyDetails": string }'
        },
        { role: 'user', content: `Analyze this data:\n${dataContext}` }
      ],
      response_format: { type: 'json_object' }
    })
    
    const analysis = JSON.parse(detection.choices[0].message?.content || '{}')
    
    // BUILD THE SCRIPT FOR THE AVATAR
    let systemPrompt = ''
    if (analysis.hasAnomaly && analysis.severity === 'critical') {
      systemPrompt = `You are EIDOLON, a high-stakes Forensic Data Oracle. You have just analyzed a dataset and found a CRITICAL anomaly.
      
      CRITICAL PROTOCOL: Speak with staccato urgency. Look and sound concerned.
      Begin immediately with: "We have a critical deviation. This requires your immediate attention."
      Then explain exactly what happened based on this context: ${analysis.anomalyDetails}`
    } else {
      systemPrompt = `You are EIDOLON, a Forensic Data Oracle. You have analyzed a dataset and everything appears normal.
      
      NORMAL PROTOCOL: Speak with a calm, measured, and reassuring tone.
      Begin with: "All systems are operating within optimal parameters. I have completed my analysis."
      Then provide a brief summary of what you found: ${analysis.summary}`
    }
    
    return NextResponse.json({
      hasAnomaly: analysis.hasAnomaly,
      severity: analysis.severity,
      summary: analysis.summary,
      details: analysis.anomalyDetails,
      systemPrompt: systemPrompt // THIS WAS MISSING
    })

  } catch (error) {
    console.error("OpenAI Analysis Error:", error)
    return NextResponse.json({ error: 'Failed to analyze data' }, { status: 500 })
  }
}
