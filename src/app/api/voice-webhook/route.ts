import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/db";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event = req.body.event;
  const sessionId = req.body.sessionId;

  // 1. If the call starts, ask first question
  if (event === "call_started") {
    const nextQ = await generateNextQuestion(sessionId);
    await sendVoiceMessage(sessionId, nextQ);
    return res.status(200).send("First question asked");
  }

  // 2. Transcript received
  if (event === "transcription") {
    const transcriptText = req.body.text;
    const candidateNumber = req.body.candidateNumber;

    // Save candidate answer
    await supabase.from("responses").insert([
      {
        session_id: sessionId,
        candidate_number: candidateNumber,
        text: transcriptText,
        timestamp: Date.now()
      }
    ]);

    // 3. Generate next dynamic question
    const nextQ = await generateNextQuestion(sessionId);

    // Interview end condition
    if (nextQ === "[END_INTERVIEW]") {
      await sendVoiceMessage(sessionId, "Thank you for your time. The interview is now complete.");
      return res.status(200).send("Interview ended");
    }

    // 4. Ask next question
    await sendVoiceMessage(sessionId, nextQ);
    return res.status(200).send("Next question asked");
  }

  res.status(200).send("OK");
}

// =========== Helpers =============== //

async function generateNextQuestion(sessionId: string): Promise<string> {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/generate-question?sessionId=${sessionId}`);
  const data = await res.json();
  return data.question;
}

async function sendVoiceMessage(sessionId: string, text: string) {
  await axios.post(
    "https://api.cartesia.ai/voice/speak",
    {
      sessionId,
      text,
      voice: "natural"
    },
    {
      headers: { Authorization: `Bearer ${process.env.CARTESIA_API_KEY}` }
    }
  );
}
