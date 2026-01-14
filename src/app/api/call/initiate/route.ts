import { NextRequest, NextResponse } from 'next/server';
import Twilio from 'twilio';

export async function GET(request: NextRequest) {
  const to = request.nextUrl.searchParams.get('to')!;
  const client = Twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  await client.calls.create({
    url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/call/voice?to=${encodeURIComponent(
      to
    )}`, 
    to,
    from: process.env.TWILIO_PHONE_NUMBER!,
  });

  return NextResponse.json({ success: true });
}
