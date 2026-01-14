import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
export async function POST(req: Request) {
  const formData = await req.formData();

  const from = formData.get("From");
  const text = formData.get("Body");
  const sessionId = formData.get("SessionId");

  await supabase.from("responses").insert([
    {
      session_id: sessionId,
      candidate_number: from,
      text,
      timestamp: Date.now(),
    },
  ]);

  return new NextResponse("Received", { status: 200 });
}
