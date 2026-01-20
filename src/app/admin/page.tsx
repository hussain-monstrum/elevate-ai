"use client"; // needed for useState and interactions
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import { useState } from "react";

export default function AdminPage() {
  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-white font-futuristic overflow-hidden px-6">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-futuristic mb-6 text-center text-black animate-fadeDown">
          Welcome to the Elevate AI Admin Panel
        </h1>

        {/* Subtitle */}
        <p className="max-w-lg text-center text-lg md:text-xl text-zinc-700 mb-12 animate-fadeIn">
          Manage users, content, and settings to ensure a seamless experience
          for our community.
        </p>

        {/* Generate Unique Link */}
        <Link href="/admin/generateLink">
        <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300">
          Generate Unique Link
        </button>
        </Link>

        {/* Futuristic floating circles */}
        <div className="absolute top-10 left-10 w-24 h-24 border border-accent rounded-full animate-rotate360 bg-black"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-accent rounded-full animate-rotate360 bg-black animation-delay-5000"></div>
      </div>
    </>
  );
}
