import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/db";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId } = req.query;

  const { data } = await supabase
    .from("responses")
    .select("*")
    .eq("session_id", sessionId)
    .order("timestamp", { ascending: true });
    if (!data) return res.status(404).json({ error: "No responses found" });
  const combined = data.map((r) => `Candidate: ${r.text}`).join("\n");

  const prompt = `
You are a professional technical interviewer.
Based on the candidate's answers so far:

${combined}

Ask the next BEST interview question. 
Keep it short, natural, conversational, and specific to the candidate's background.
If the interview has enough content (5–8 answers), respond ONLY with "[END_INTERVIEW]".
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "system", content: prompt }]
  });

  const question = completion.choices[0].message?.content ?? "Can you explain further?";
  res.status(200).json({ question });
}
