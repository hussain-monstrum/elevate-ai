"use client"; // needed for useState and interactions
import { Analytics } from "@vercel/analytics/next";
import { useState } from "react";

export default function Home() {
  const [clicked, setClicked] = useState(false);
  const [input, setInput] = useState("");


  const handleSubmit = async () => {
    console.log("User Prompt:", input);

    const response = await fetch('/api/askElevate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await response;
    console.log(data)

    alert(`Langchain Response: ${data}`);

  }
  return (
    <>
      <Analytics />

      <div className="relative flex min-h-screen flex-col items-center justify-center bg-white font-futuristic overflow-hidden px-6">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-futuristic mb-6 text-center text-black animate-fadeDown">
        Welcome to the Elevate AI
      </h1>

      {/* Subtitle */}
      <p className="max-w-lg text-center text-lg md:text-xl text-zinc-700 mb-12 animate-fadeIn">
        Connect, collaborate, and engage with like-minded innovators. Our community is curated for exclusive events and networking.
      </p>

      {/* Interact with AI button */}
      <button
        className="px-8 py-4 text-lg text-black font-futuristic tracking-wide text-accent border-2 border-accent border-black rounded-lg transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_20px_#00FFE0]"
        onClick={() => {
          if (!clicked)
          setClicked(true)
          else{
          setClicked(false);
        }}}
      >
        Interact with AI
      </button>

      {/* Modal after click */}
      {clicked && (
        <div className="flex flex-col gap-3 w-full m-10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your AI prompt..."
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
            />

            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-lg bg-black text-white hover:bg-blue-700"
            >
              Run LangChain
            </button>
          </div>
      )}
      {!clicked && (<div></div>
      )}
      
      {/* Futuristic floating circles */}
      <div className="absolute top-10 left-10 w-24 h-24 border border-accent rounded-full animate-rotate360 bg-black"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 border border-accent rounded-full animate-rotate360 bg-black animation-delay-5000"></div>
      
    </div>
    </>
  );
}
