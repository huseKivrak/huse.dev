import { NextResponse } from "next/server";

export async function GET() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!agentId || !apiKey) {
    return NextResponse.json(
      { error: "Missing ElevenLabs configuration" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get signed URL" },
        { status: response.status }
      );
    }

    const body = await response.json();
    return NextResponse.json({ signedUrl: body.signed_url });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to ElevenLabs" },
      { status: 500 }
    );
  }
}
