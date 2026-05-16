import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  
  const text = await file.text()
  let data
  
  try {
    if (file.name.endsWith('.json')) {
      data = JSON.parse(text)
    } else {
      const lines = text.trim().split('\n')
      const headers = lines[0].split(',')
      data = lines.slice(1).map(line => {
        const values = line.split(',')
        return Object.fromEntries(headers.map((h, i) => [h.trim(), values[i]?.trim()]))
      })
    }
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse file' }, { status: 500 })
  }
}