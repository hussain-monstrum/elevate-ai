export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../lib/supabaseClient";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { phone, firstName, lastName, role } = body;
  
  if (!phone) return NextResponse.json({ error: "Phone number required" }, { status: 400 });

  const supabase = getSupabase();

  // Check if session already exists and is completed
  const { data: existingSession } = await supabase
    .from("sms_sessions")
    .select("*")
    .eq("phone", phone)
    .single();

  if (existingSession?.completed) {
    return NextResponse.json({ error: "You've already scheduled a call!" }, { status: 400 });
  }

  // Create session - waiting for user's first message
  await supabase
    .from("sms_sessions")
    .upsert({
      phone: phone,
      current_step: "awaiting_first_message",
      answers: {
        first_name: firstName || "",
        last_name: lastName || "",
        role: role || "",
      },
      completed: false,
    });

  // Optionally save to profiles table
  await supabase.from("profiles").upsert({
    phone: phone,
    first_name: firstName || "",
    last_name: lastName || "",
    role: role || "",
  });

  return NextResponse.json({ 
    ok: true,
    twilioNumber: process.env.TWILIO_PHONE 
  });
}