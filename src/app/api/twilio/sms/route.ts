import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";
import { getSupabase } from "../../../../lib/supabaseClient";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();

  const data = await req.formData();
  const from = data.get("From") as string;
  const body = (data.get("Body") as string)?.trim();
  console.log(data, from, body);

  if (!from || !body) return new NextResponse("Missing data", { status: 400 });

  // Check if user has already been processed
  const { data: sessionData } = await supabase
    .from("sms_sessions")
    .select("*")
    .eq("phone", from)
    .single();

  // If session already completed, ignore
  if (sessionData?.completed) {
    return new NextResponse("You've already been scheduled for a call!");
  }

  // First message from user - create/update session and schedule call
  await supabase.from("sms_sessions").upsert({
    phone: from,
    completed: true,
    answers: { initial_message: body },
    current_step: "completed",
  });

  // Create or update profile
  await supabase.from("profiles").upsert({
    phone: from,
    responses: { initial_message: body },
  });

  // Schedule the voice call
  await supabase.from("voice_call_jobs").insert({ phone: from });

  return new NextResponse(
    "✅ Thank you for reaching out! You will receive a call from Ellie (our charming and friendly AI assistant) shortly!"
  );
}