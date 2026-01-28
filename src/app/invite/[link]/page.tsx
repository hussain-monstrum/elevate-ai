import { getSupabase } from "@/lib/supabaseClient";

interface InvitePageProps {
  params: Promise<{ link: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { link } = await params;

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Invalid invite link</h1>
      </div>
    );
  }

  const supabase = getSupabase();

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";
  const fullInviteUrl = `${baseUrl}/invite/${link}`;

  /**
   * 1️⃣ Fetch invitee
   */
  const { data: invitee, error: inviteError } = await supabase
    .from("invitees")
    .select("first_name, phone")
    .eq("invite_link", fullInviteUrl)
    .single();

  if (inviteError || !invitee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Invite not found</h1>
      </div>
    );
  }

  /**
   * 2️⃣ Prevent duplicate voice jobs
   * (important if user refreshes page)
   */
  const { data: existingJob } = await supabase
    .from("voice_call_jobs")
    .select("id")
    .eq("phone", invitee.phone)
    .eq("referred_by", true)
    .maybeSingle();

  /**
   * 3️⃣ Insert voice job if not exists
   */
  if (!existingJob) {
    await supabase.from("voice_call_jobs").insert({
      phone: invitee.phone,
      status: "pending",
      referred_by: true,
    });
  }
  else{
    console.log("Voice job already exists for this invitee.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <h1 className="text-4xl font-bold text-center text-indigo-950">
        Hi {invitee.first_name}, Ellie will call you soon!
      </h1>
    </div>
  );
}
