import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/db";
import { OpenAIEmbeddings } from "@langchain/openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId } = req.query;

  const { data } = await supabase
    .from("responses")
    .select("*")
    .eq("session_id", sessionId);

  if (!data) return res.status(404).json({ error: "No responses found" });

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
  let totalScore = 0;

  for (const r of data) {
    const vector = await embeddings.embedQuery(r.text);
    totalScore += vector.reduce((a, b) => a + b, 0); // simple sum as score
  }

  const overallScore = Math.min(100, Math.floor(totalScore)); // normalize
  res.status(200).json({ overallScore });
}
