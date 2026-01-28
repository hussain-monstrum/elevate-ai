"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link for navigation
import { getSupabase } from "../../../lib/supabaseClient";
import { ChartBarIcon } from "@heroicons/react/24/outline"; // Added an icon for better UX

export default function GenerateLinkPage() {
  const supabase = getSupabase();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "",
    achievements: "",
    referred_by: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      const sanitized = value.replace(/^\+1/, "");
      setForm({ ...form, [name]: sanitized });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setInviteLink(null);

    const { data: link, error } = await supabase.rpc(
      "create_invitee_profile_with_link",
      {
        p_first_name: form.first_name,
        p_last_name: form.last_name,
        p_phone: `+1${form.phone_number}`,
        p_role: form.role,
        p_achievements: form.achievements,
        p_referred_by: form.referred_by,
      },
    );

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage("✅ Profile & Invitee created successfully!");
      setInviteLink(link as string);
      setForm({
        first_name: "",
        last_name: "",
        phone_number: "",
        role: "",
        achievements: "",
        referred_by: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 relative">
      {/* Admin Navigation Button */}
      {/* <div className="absolute top-6 right-6">
        <Link
          href="/admin/viewScores"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-black text-sm font-medium hover:bg-black hover:text-white transition-all duration-200"
        >
          <ChartBarIcon className="h-4 w-4" />
          View Scores
        </Link>
      </div> */}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 rounded-xl border p-8 shadow"
      >
        <h1 className="text-3xl font-bold text-center text-black">
          Generate Unique Invite
        </h1>

        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
          className="w-full border p-3 border-black rounded italic text-gray-600"
        />

        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
          className="w-full border p-3 border-black rounded italic text-gray-600"
        />

        <div className="flex items-center border border-black rounded overflow-hidden">
          <span className="flex items-center px-3 bg-gray-100 text-gray-700 border-r border-black">
            🇺🇸 +1
          </span>
          <input
            name="phone_number"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
            required
            type="tel"
            pattern="\d{10}"
            title="Phone number must be exactly 10 digits"
            maxLength={10}
            className="w-full p-3 outline-none italic text-gray-600"
          />
        </div>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          aria-label="Role"
          className="w-full border p-3 border-black rounded italic text-gray-600 bg-white"
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="Fast-Track Approved">Fast-Track Approved</option>
          <option value="Investor/VC">Investor/VC</option>
          <option value="Verified Member">Verified Member</option>
        </select>

        <textarea
          name="achievements"
          placeholder="Achievements"
          value={form.achievements}
          onChange={handleChange}
          required
          className="w-full border p-3 border-black rounded italic text-gray-600"
        />

        <input
          name="referred_by"
          placeholder="Referred By"
          value={form.referred_by}
          onChange={handleChange}
          required
          className="w-full border p-3 border-black rounded italic text-gray-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Submit"}
        </button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
        {inviteLink && (
          <div className="mt-2">
            <p className="text-center text-sm mb-1">🎉 Invite Link:</p>
            <div className="overflow-x-auto">
              <a
                href={inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {inviteLink}
              </a>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
