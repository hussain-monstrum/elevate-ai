import { NextResponse } from "next/server";
import {
  LinkedInProfileResponse,
} from "@/lib/linkedin";
import { p } from "framer-motion/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");


  
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  });
  const tokenData = await tokenRes.json()
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN || tokenData.access_token;

  // Fetch profile
  const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const profileData = await profileRes.json();

  console.log("PROFILE DATA:", profileData);

  
  // Fetch email
  const email = profileData.email;


  console.log("EMAIL:", email);
  console.log("PICTURE:", profileData.picture);
  const picture = profileData.picture || "";
  // Normalize final object for frontend
  const normalized = {
    firstName: profileData.given_name,
    lastName: profileData.family_name,
    picture,
    email,
    headline: null,
  };

  return NextResponse.redirect(
    `/linkedin-success?data=${encodeURIComponent(JSON.stringify(normalized))}`
  );
}
