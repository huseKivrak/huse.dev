export const config = { runtime: 'edge' };

export default async function handler(): Promise<Response> {
  let message = '';
  try {
    const conn = new URL(process.env.EDGE_CONFIG ?? '');
    const res = await fetch(
      `${conn.origin}${conn.pathname}/item/message?token=${conn.searchParams.get('token')}`
    );
    if (res.ok) message = await res.json();
  } catch {
    // stay black
  }
  return new Response(JSON.stringify({ message }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}
