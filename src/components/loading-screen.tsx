"use client";

import { useEffect, useState } from "react";
import { LOADING_TEXTS } from "@/lib/characters";

const LoadingScreen = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setTextIndex(1), 700);
    const timer2 = setTimeout(() => setTextIndex(2), 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const displayText = LOADING_TEXTS[textIndex] ?? LOADING_TEXTS[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-t-white/80 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>

      <p className="text-white/70 text-sm animate-pulse">{displayText}</p>
    </div>
  );
};

export default LoadingScreen;
