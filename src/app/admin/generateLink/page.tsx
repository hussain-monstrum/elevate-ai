"use client";

import { useState } from "react";
import { getSupabase } from "../../../lib/supabaseClient";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      // Prevent user from typing +1 manually
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

    // Call RPC function that creates profile + invitee + generates unique link
    const { data: link, error } = await supabase.rpc(
      "create_invitee_profile_with_link",
      {
        p_first_name: form.first_name,
        p_last_name: form.last_name,
        p_phone: `+1${form.phone_number}`, // always prepend +1
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
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
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

        {/* Phone input with US flag +1 */}
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
            pattern="\d{10}" // exactly 10 digits
            title="Phone number must be exactly 10 digits"
            maxLength={10} // prevent typing more than 10 digits
            className="w-full p-3 outline-none italic text-gray-600"
          />
        </div>

        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          required
          className="w-full border p-3 border-black rounded italic text-gray-600"
        />

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
