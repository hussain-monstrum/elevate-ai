import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { from, text, sessionId } = req.body;

  await supabase.from("responses").insert([
    { session_id: sessionId, candidate_number: from, text, timestamp: Date.now() }
  ]);

  res.status(200).send("Received");
}
