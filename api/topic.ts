export const config = { runtime: 'edge' }

const REPO = 'huseKivrak/huse.dev'
const PATH = 'src/topic.json'
const API = `https://api.github.com/repos/${REPO}/contents/${PATH}`

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405)
  }

  const adminSecret = process.env.ADMIN_SECRET
  const githubToken = process.env.GITHUB_TOKEN
  if (!adminSecret || !githubToken) {
    return json({ error: 'server not configured' }, 500)
  }

  let body: { topic?: unknown; secret?: unknown }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid json' }, 400)
  }

  if (body.secret !== adminSecret) {
    return json({ error: 'unauthorized' }, 401)
  }

  const topic = typeof body.topic === 'string' ? body.topic.trim() : ''
  if (!topic || topic.length > 200) {
    return json({ error: 'topic must be 1–200 chars' }, 400)
  }

  const ghHeaders = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'huse-dev-admin',
  }

  const getRes = await fetch(API, { headers: ghHeaders })
  if (!getRes.ok) {
    return json({ error: 'github GET failed', status: getRes.status }, 502)
  }
  const { sha } = (await getRes.json()) as { sha: string }

  const newContent = JSON.stringify({ topic }, null, 2) + '\n'
  const putRes = await fetch(API, {
    method: 'PUT',
    headers: { ...ghHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `topic: ${topic}`,
      content: btoa(newContent),
      sha,
    }),
  })
  if (!putRes.ok) {
    const detail = await putRes.text()
    return json({ error: 'github PUT failed', status: putRes.status, detail }, 502)
  }
  const putBody = (await putRes.json()) as { commit?: { sha?: string } }
  return json({ ok: true, topic, commit: putBody.commit?.sha })
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
