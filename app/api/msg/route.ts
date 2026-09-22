export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  let message = ''
  try {
    const conn = new URL(process.env.EDGE_CONFIG ?? '')
    const res = await fetch(
      `${conn.origin}${conn.pathname}/item/message?token=${conn.searchParams.get('token')}`,
      { cache: 'no-store' }
    )
    if (res.ok) message = await res.json()
  } catch {
    // stay black
  }
  return Response.json({ message }, { headers: { 'cache-control': 'no-store' } })
}
