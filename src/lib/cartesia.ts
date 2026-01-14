import axios from "axios";

const CARTESIA_API_BASE = "https://api.cartesia.ai";

export async function sendSMS(to: string, messages: string[]) {
    console.log("Sending SMS to:", to);
    console.log("Messages:", messages);
    console.log("Using API Key:", process.env.CARTESIA_API_KEY);
  return axios.post(
    `${CARTESIA_API_BASE}/sms/send`,
    { to, messages },
    { headers: { Authorization: `Bearer ${process.env.CARTESIA_API_KEY}` } }
  );
}

export async function startVoiceCall(to: string, sessionId: string) {
  return axios.post(
    `${CARTESIA_API_BASE}/voice/call`,
    { to, sessionId },
    { headers: { Authorization: `Bearer ${process.env.CARTESIA_API_KEY}` } }
  );
}

export async function sendVoiceMessage(sessionId: string, text: string) {
  return axios.post(
    "https://api.cartesia.ai/voice/speak",
    { sessionId, text },
    {
      headers: {
        Authorization: `Bearer ${process.env.CARTESIA_API_KEY}`
      }
    }
  );
}
