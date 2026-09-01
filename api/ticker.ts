export const config = { runtime: 'edge' };

export default async function handler(): Promise<Response> {
  let items: unknown[] = [];
  try {
    const conn = new URL(process.env.EDGE_CONFIG ?? '');
    const res = await fetch(
      `${conn.origin}${conn.pathname}/item/ticker?token=${conn.searchParams.get('token')}`
    );
    if (res.ok) {
      const val = await res.json();
      if (Array.isArray(val)) items = val;
    }
  } catch {
    // empty ticker
  }
  return new Response(JSON.stringify({ items }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}
