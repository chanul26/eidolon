export async function createAvatarSession(systemPrompt: string) {
  const res = await fetch('/api/avatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('Avatar API Error:', err.details ?? err.error ?? res.statusText)
    throw new Error(err.error ?? 'Failed to create Beyond Presence session')
  }

  return await res.json()
}
