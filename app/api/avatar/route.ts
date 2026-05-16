import { NextRequest, NextResponse } from 'next/server'

const BEY_API = 'https://api.bey.dev/v1'

function getApiKey() {
  return (
    process.env.BEYOND_PRESENCE_API_KEY ||
    process.env.NEXT_PUBLIC_BEYOND_PRESENCE_API_KEY ||
    ''
  )
}

async function beyFetch(path: string, init?: RequestInit) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('Beyond Presence API key is not configured')
  }

  const res = await fetch(`${BEY_API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      ...init?.headers,
    },
  })

  return res
}

type Avatar = { id: string; status: string; name: string }

async function listAvailableAvatars(): Promise<Avatar[]> {
  const res = await beyFetch('/avatars?limit=50')
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to list avatars: ${err}`)
  }

  const json = await res.json()
  return (json.data ?? []).filter((a: Avatar) => a.status === 'available')
}

async function resolveAvatarId(): Promise<string> {
  const preferred =
    process.env.BEYOND_AVATAR_ID ||
    process.env.NEXT_PUBLIC_AVATAR_ID ||
    ''

  const avatars = await listAvailableAvatars()
  if (avatars.length === 0) {
    throw new Error('No available avatars found for this API key')
  }

  if (preferred) {
    const match = avatars.find((a) => a.id === preferred)
    if (match) return match.id
    console.warn(
      `Avatar ${preferred} not found for this account; using ${avatars[0].name} (${avatars[0].id})`,
    )
  }

  return avatars[0].id
}

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt } = await req.json()
    const avatarId = await resolveAvatarId()

    const res = await beyFetch('/agents', {
      method: 'POST',
      body: JSON.stringify({
        name: 'EIDOLON',
        avatar_id: avatarId,
        system_prompt:
          systemPrompt ||
          'You are EIDOLON, an AI forensic assistant analyzing data.',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Beyond Presence agent error:', err)
      return NextResponse.json(
        { error: 'Failed to create Beyond Presence agent', details: err },
        { status: res.status },
      )
    }

    const agent = await res.json()
    const url = `https://bey.chat/${agent.id}`

    return NextResponse.json({
      url,
      agentId: agent.id,
      avatarId: agent.avatar_id,
    })
  } catch (error) {
    console.error('Avatar API route error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create avatar session',
      },
      { status: 500 },
    )
  }
}
