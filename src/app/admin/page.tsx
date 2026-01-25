"use client";

import Link from "next/link";
import { 
  LinkIcon, 
  ChartBarIcon 
} from "@heroicons/react/24/outline";

export default function AdminPage() {
  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-white font-sans overflow-hidden px-6">
        
        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 border border-black rounded-full animate-pulse opacity-10"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-black rounded-full animate-pulse opacity-10 delay-700"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-3xl w-full text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-black italic uppercase">
            Admin Control
          </h1>

          <p className="text-zinc-500 text-lg md:text-xl mb-16 max-w-xl mx-auto font-medium leading-relaxed">
            Manage your recruitment intelligence. Generate secure invite links or review automated candidate scoring.
          </p>

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Generate Link Card */}
            <Link 
              href="/admin/generateLink"
              className="group flex flex-col items-center justify-center p-10 bg-gray-50 border border-gray-100 rounded-[2.5rem] transition-all duration-300 hover:border-black hover:bg-white hover:shadow-2xl"
            >
              <div className="h-16 w-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LinkIcon className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black uppercase italic mb-2 text-black">Generate Link</h2>
              <p className="text-sm text-gray-400">Create unique interview invites</p>
            </Link>

            {/* View Scores Card */}
            <Link 
              href="/admin/viewScores"
              className="group flex flex-col items-center justify-center p-10 bg-gray-50 border border-gray-100 rounded-[2.5rem] transition-all duration-300 hover:border-black hover:bg-white hover:shadow-2xl"
            >
              <div className="h-16 w-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarIcon className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black uppercase italic mb-2 text-black">View Scores</h2>
              <p className="text-sm text-gray-400">Review AI-vetted candidates</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}