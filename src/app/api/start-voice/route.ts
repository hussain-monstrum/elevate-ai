import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId, candidateNumber } = JSON.parse(req.body);

  await axios.post(
    "https://api.cartesia.ai/voice/call",
    {
      to: candidateNumber,
      sessionId,
      webhookUrl: `${process.env.PUBLIC_URL}/api/voice-webhook`
    },
    {
      headers: { Authorization: `Bearer ${process.env.CARTESIA_API_KEY}` }
    }
  );

  res.status(200).json({ message: "Voice interview started" });
}
