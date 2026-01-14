"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { on } from "events";

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

  const [pressed, setPressed] = useState(false);
  const [started, setStarted] = useState(false);

  const [manualData, setManualData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  // Load stored LinkedIn/manual data once
  // useEffect(() => {
  //   const saved = localStorage.getItem("linkedinProfile");
  //   if (!saved) return;

  //   const profile = JSON.parse(saved) as LinkedInProfile;

  //   function update(){
  //   setState({
  //     clicked: false,
  //     mode: null,
  //     profile,
  //   });}
  //   update();
  // }, []);

  const { clicked, mode, profile } = state;
  const [score, setScore] = useState<number | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);

  const startInterview = async () => {
    setStarted(true);
    const res = await fetch("/api/start-interview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: manualData.phone }),
    });
    const data = await res.json();
    setSessionId(data.sessionId);
    setShowMessageModal(true);
  };

  const startVoice = async () => {
    if (!sessionId) return;
    const res = await fetch("/api/start-voice", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json();
    alert("Voice call started!");
  };

  const getScore = async () => {
    if (!sessionId) return;
    const res = await fetch(`/api/score-interview?sessionId=${sessionId}`);
    const data = await res.json();
    setScore(data.overallScore);
  };

  // function handleAISubmit() {
  //   if (!profile) return;

  //   const phone = profile.phone?.replace(/\D/g, ""); // clean digits only
  //   if (!phone) {
  //     alert("Phone number is missing.");
  //     return;
  //   }

  //   const message = `Hi ${profile.firstName}, thanks for getting started with Elevate AI! This is your onboarding assistant.`;

  //   // Encode message for URL
  //   const encodedMessage = encodeURIComponent(message);

  //   // Open SMS app with prefilled message
  //   window.location.href = `sms:${phone}?body=${encodedMessage}`;
  // }

  // Save manual info
  function handleManualSubmit() {
    const newProfile = {
      firstName: manualData.firstName,
      lastName: manualData.lastName,
      phone: manualData.phone,
      picture: "/default-avatar.png", // optional placeholder
      headline: "Manual Profile",
      email: "",
    };

    // Save to localStorage
    localStorage.setItem("linkedinProfile", JSON.stringify(newProfile));

    // Set state
    setState({
      clicked: true,
      mode: "manual",
      profile: newProfile,
    });
  }

  const [showMessageModal, setShowMessageModal] = useState(false);

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

      {/* ——————————————————————— */}
      {/* MANUAL ENTRY MODAL */}
      {/* ——————————————————————— */}
      {clicked && mode === "manual" && !profile && (
        <div className="mt-10 p-6 border rounded-2xl shadow-lg w-96 bg-gray-50">
          <h2 className="text-lg  text-black rounded-2xl italic  required font-semibold mb-4 text-center">
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
              placeholder="Phone Number"
              value={manualData.phone}
              onChange={(e) =>
                setManualData({ ...manualData, phone: e.target.value })
              }
              className="text-lg border-2 text-gray-400 italic border-black required px-4 py-2 rounded-lg"
            />

            <button
              onClick={handleManualSubmit}
              className="mt-4 bg-black text-white py-3 rounded-lg"
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

          {/* Optional email */}
          {profile.email && (
            <p className="mt-2 text-sm text-gray-600">{profile.email}</p>
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
                      "
          >
            {started ? "Message Sent!" : "Talk with Ellie"}
          </button>

          {/* <button onClick={startVoice} disabled={!started}>
            Start Voice Interview
          </button> */}

          {/* <button onClick={getScore} disabled={!started}>
            Get Score
          </button> */}
          {score !== null && <p>Candidate Score: {score}</p>}
        </div>
      )}

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
        Message Sent
      </h3>

      <p className="mt-2 text-gray-600">
        Ellie just sent you a message to get started! Check your messages.
      </p>

      <button
        onClick={() => {
          window.location.href = "sms:+18668256571";
        }}
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
