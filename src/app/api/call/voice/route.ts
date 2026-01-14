import { NextRequest, NextResponse } from 'next/server';
import { VoiceResponse } from 'twilio';

export async function POST(request: NextRequest) {
  const twiml = new VoiceResponse();

  twiml.say(
    'Thank you for calling Elevate. Please hold while we connect you to our AI onboarding agent.'
  );

  // forward call into a Websocket route for real-time interaction
  twiml.connect().stream({
    url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/call/stream`
  });

  return NextResponse.json(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
