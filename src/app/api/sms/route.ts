import { NextRequest, NextResponse } from 'next/server';
import { twiml } from 'twilio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const from = body.get('From') as string;
  const text = (body.get('Body') as string).trim();

  const response = new twiml.MessagingResponse();

  // Save incoming SMS
  await supabase.from('sms_conversations').insert({ phone: from, body: text });

  // Check if user already has session
  let { data: session } = await supabase
    .from('call_sessions')
    .select('*')
    .eq('phone', from)
    .single();

  // New user: greeting + ask role
  if (!session || !session.role) {
    if (!session) {
      const insert = await supabase
        .from('call_sessions')
        .insert({ phone: from })
        .select('*');
      session = insert.data![0];
    }

    if (!/founder|investor|other/i.test(text)) {
      response.message(
        "Welcome to Elevate! Are you a 'founder', 'investor', or 'other'?"
      );
    } else {
      // User replied with role
      await supabase
        .from('call_sessions')
        .update({ role: text })
        .eq('id', session.id);

      response.message(
        `Great! We'll call you shortly to complete onboarding — expect a call to this number.`
      );

      // trigger outbound call
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/call/initiate?to=${encodeURIComponent(
          from
        )}`
      );
    }
  }

  return NextResponse.json(
    response.toString(),
    { headers: { 'Content-Type': 'text/xml' } }
  );
}
