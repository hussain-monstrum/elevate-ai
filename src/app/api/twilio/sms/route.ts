import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";
import { getSupabase } from "@/lib/supabaseClient"; // <-- updated import
import { getStep, formatStepMessage, ELEVATE_SMS_FORM } from "@/lib/elevateForm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = getSupabase(); // <-- initialize here

  const data = await req.formData();
  const from = data.get("From") as string;
  const body = (data.get("Body") as string)?.trim();
  console.log(data, from, body);

  if (!from || !body) return new NextResponse("Missing data", { status: 400 });

  const { data: sessionData } = await supabase
    .from("sms_sessions")
    .select("*")
    .eq("phone", from)
    .single();

  if (!sessionData) {
    return new NextResponse("Session not found. Please visit the website to start a new interview.");
  }

  if (sessionData.completed) return new NextResponse("Session already completed!");

  const stepId = sessionData.current_step;
  const step = getStep(stepId);

  let answer: string;

  if (step.type === "choice" && step.options) {
    const index = parseInt(body) - 1;
    if (isNaN(index) || index < 0 || index >= step.options.length) {
      return new NextResponse("Invalid choice. Reply with the number from the list.");
    }
    answer = step.options[index];
  } else {
    answer = body;
  }

  const answers = { ...sessionData.answers, [step.id]: answer };

  const nextStepId = step.next(answer);

  if (!nextStepId) {
    // Save profile
    const role = answers.role || answer;

    await supabase.from("profiles").upsert({
      phone: from,
      first_name: answers.first_name || "",
      last_name: answers.last_name || "",
      role,
      responses: answers,
    });

    await supabase
      .from("sms_sessions")
      .update({ answers, completed: true, current_step: step.id })
      .eq("phone", from);

    await supabase.from("voice_call_jobs").insert({ phone: from });

    return new NextResponse(
      "✅ Thank you! Your responses have been recorded. Now you will receive a call from Ellie (Our charming and friendly AI assistant) shortly!"
    );
  }

  const nextStep = getStep(nextStepId);

  await supabase
    .from("sms_sessions")
    .update({ answers, current_step: nextStepId })
    .eq("phone", from);

  return new NextResponse(formatStepMessage(nextStep));
}
