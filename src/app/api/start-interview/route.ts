export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";
import { getSupabase } from "@/lib/supabaseClient";
import { ELEVATE_SMS_FORM, getStep, formatStepMessage } from "@/lib/elevateForm";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { phone } = body;
  if (!phone) return NextResponse.json({ error: "Phone number required" }, { status: 400 });

  const supabase = getSupabase(); // <- lazy init

  // Create or reset session
  const d2 = await supabase
    .from("sms_sessions")
    .upsert({
      phone: phone,
      current_step: ELEVATE_SMS_FORM.start,
      answers: {},
      completed: false,
    })
    .select();

  const step = getStep(ELEVATE_SMS_FORM.start);
  const message = formatStepMessage(step);

  const client = Twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

  await client.messages.create({
    to: phone,
    from: process.env.TWILIO_PHONE!,
    body: message,
  });

  return NextResponse.json({ ok: true });
}
