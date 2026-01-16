"use client";

import { useState } from "react";
import Image from "next/image";

interface LinkedInProfile {
  firstName: string;
  lastName: string;
  picture: string;
  headline?: string;
  email?: string;
  phone?: string;
}

export default function Home() {
  const [state, setState] = useState({
    clicked: false,
    mode: null as "linkedin" | "manual" | null,
    profile: null as LinkedInProfile | null,
  });

  const [started, setStarted] = useState(false);
  const [twilioNumber, setTwilioNumber] = useState("");

  const [manualData, setManualData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const { clicked, mode, profile } = state;
  const [showMessageModal, setShowMessageModal] = useState(false);

  const startInterview = async () => {
    if (!profile?.phone) {
      alert("Phone number is required");
      return;
    }

    try {
      const res = await fetch("/api/start-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: profile.phone,
          firstName: profile.firstName,
          lastName: profile.lastName,
          role: profile.headline || "",
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setTwilioNumber(data.twilioNumber);
        setStarted(true);
        setShowMessageModal(true);
      } else {
        alert(data.error || "Failed to start session");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  const openSMSApp = () => {
    const message = encodeURIComponent("Hi Ellie, I would like to join Elevate!");
    window.location.href = `sms:${twilioNumber}?body=${message}`;
  };

  // Save manual info
  function handleManualSubmit() {
    if (!manualData.firstName || !manualData.lastName || !manualData.phone) {
      alert("Please fill in all fields");
      return;
    }

    const newProfile = {
      firstName: manualData.firstName,
      lastName: manualData.lastName,
      phone: manualData.phone,
      picture: "/default-avatar.png",
      headline: "",
      email: "",
    };

    setState({
      clicked: true,
      mode: "manual",
      profile: newProfile,
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <h1 className="text-5xl mb-6 text-black font-semibold">
        Welcome to Elevate AI
      </h1>

      {/* Start Button */}
      {!profile && (
        <button
          onClick={() => setState((s) => ({ ...s, clicked: !s.clicked }))}
          className="px-8 py-4 border-2 border-black text-black italic rounded-lg"
        >
          Apply to Elevate
        </button>
      )}

      {/* Options: LinkedIn or Manual */}
      {clicked && !mode && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => (window.location.href = "/api/linkedin/auth")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow"
          >
            Use LinkedIn
          </button>

          <button
            onClick={() => setState((s) => ({ ...s, mode: "manual" }))}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg shadow"
          >
            Fill Manually
          </button>
        </div>
      )}

      {/* MANUAL ENTRY MODAL */}
      {clicked && mode === "manual" && !profile && (
        <div className="mt-10 p-6 border rounded-2xl shadow-lg w-96 bg-gray-50">
          <h2 className="text-lg text-black rounded-2xl italic required font-semibold mb-4 text-center">
            Enter Your Details
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={manualData.firstName}
              onChange={(e) =>
                setManualData({ ...manualData, firstName: e.target.value })
              }
              className="text-lg border-2 text-gray-400 italic border-black required px-4 py-2 rounded-lg"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={manualData.lastName}
              onChange={(e) =>
                setManualData({ ...manualData, lastName: e.target.value })
              }
              className="text-lg border-2 text-gray-400 italic border-black required px-4 py-2 rounded-lg"
            />

            <input
              type="tel"
              placeholder="Phone Number (e.g., +1234567890)"
              value={manualData.phone}
              onChange={(e) =>
                setManualData({ ...manualData, phone: e.target.value })
              }
              className="text-lg border-2 text-gray-400 italic border-black required px-4 py-2 rounded-lg"
            />

            <button
              onClick={handleManualSubmit}
              className="mt-4 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Profile Card */}
      {profile && (
        <div
          className="
            mt-14 w-96 p-8 rounded-3xl
            bg-white/40 backdrop-blur-xl
            shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            border border-white/30
            relative flex flex-col items-center
            transition-all duration-300 hover:scale-[1.02]
          "
        >
          {/* Decorative glowing circle background */}
          <div className="absolute -top-10 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 right-0 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>

          {/* Profile Image with gradient ring */}
          <div
            className="
              w-36 h-36 rounded-full p-[3px]
              bg-linear-to-br from-blue-500 via-purple-400 to-pink-400
              shadow-lg
            "
          >
            <Image
              src={profile.picture || "/default-avatar.png"}
              width={140}
              height={140}
              alt="Profile"
              className="rounded-full object-cover w-full h-full"
            />
          </div>

          {/* Name */}
          <h2 className="text-3xl font-bold mt-4 text-gray-900 tracking-tight">
            {profile.firstName} {profile.lastName}
          </h2>

          {/* Headline */}
          {profile.headline && (
            <p className="text-gray-700 mt-2 text-lg italic text-center">
              {profile.headline}
            </p>
          )}

          {/* Phone */}
          {profile.phone && (
            <p className="mt-1 text-sm font-medium text-gray-500">
              📞 {profile.phone}
            </p>
          )}

          {/* Button */}
          <button
            onClick={startInterview}
            disabled={started}
            className="
              mt-6 w-full py-3 rounded-xl
              bg-black text-white
              text-lg font-semibold tracking-wide
              transition-all duration-300 hover:bg-gray-900 hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {started ? "Session Started!" : "Talk with Ellie"}
          </button>
        </div>
      )}

      {/* MESSAGE MODAL */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-96 shadow-2xl text-center relative">
            {/* Close button */}
            <button
              onClick={() => setShowMessageModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            {/* Messages icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4C2.9 2 2 2.9 2 4v14l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900">
              Ready to Talk to Ellie?
            </h3>

            <p className="mt-2 text-gray-600">
              Click below to send a text message and Ellie will call you shortly!
            </p>

            <button
              onClick={openSMSApp}
              className="mt-6 w-full py-3 rounded-xl bg-black text-white text-lg font-semibold hover:bg-gray-900 transition"
            >
              Open Messages
            </button>
          </div>
        </div>
      )}
    </div>
  );
}