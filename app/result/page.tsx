"use client";
// app/result/page.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PhotocardResult from "@/components/PhotocardResult";
import Confetti from "@/components/Confetti";
import StarBackground from "@/components/StarBackground";

export default function ResultPage() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name") ?? "";
  const group = searchParams.get("group") ?? "";
  const image = searchParams.get("image") ?? "";

  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  useEffect(() => {
    // Stagger the reveal animations
    const t1 = setTimeout(() => setRevealed(true), 300);
    const t2 = setTimeout(() => setShowConfetti(true), 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleShare = async () => {
    const text = `✨ I just got ${name}'s photocard from ${group} on K-Pop Gacha Box! 🎁`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "K-Pop Gacha Result!", text });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      setShareMsg("Copied to clipboard! 📋");
      setTimeout(() => setShareMsg(""), 3000);
    }
  };

  if (!name || !group) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-6xl mb-4">🎴</p>
          <p className="font-bold text-gray-500 mb-4">No result to display.</p>
          <Link href="/">
            <button className="btn-primary">Back to Home</button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 sm:py-12 overflow-hidden flex flex-col">
      <StarBackground />
      <Confetti active={showConfetti} />

      <div className="relative z-10 max-w-md mx-auto w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-6 animate-slide_up">
          <div
            className="inline-block mb-3 px-5 py-2 rounded-full text-sm font-black tracking-widest uppercase"
            style={{
              background: "linear-gradient(135deg, #FFB7C5, #E5C4FF)",
              color: "white",
              boxShadow: "0 4px 16px rgba(255, 143, 171, 0.4)",
            }}
          >
            ✨ YOU GOT!
          </div>

          <h1
            className="text-3xl sm:text-4xl font-black leading-tight"
            style={{
              background: "linear-gradient(135deg, #FF8FAB, #B8E0FF, #E5C4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "var(--font-nunito)",
            }}
          >
            {name}
          </h1>
          <p
            className="text-sm font-black tracking-widest uppercase mt-1"
            style={{ color: "#7EC8E3" }}
          >
            {group}
          </p>
        </div>

        {/* Photocard */}
        <div
          className="mb-8 w-full flex justify-center"
          style={{ opacity: revealed ? 1 : 0, transition: "opacity 0.3s" }}
        >
          <PhotocardResult
            name={name}
            group={group}
            image={image}
            isRevealing={true}
          />
        </div>

        {/* Celebration text */}
        <div
          className="w-full rounded-3xl p-5 mb-6 text-center animate-slide_up delay-400"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            border: "2px solid rgba(255, 183, 197, 0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-black text-gray-700 text-lg mb-1">
            Congratulations!
          </p>
          <p className="text-sm text-gray-400 font-semibold leading-relaxed">
            You received <strong style={{ color: "#FF5C8A" }}>{name}</strong>'s
            photocard from <strong style={{ color: "#7EC8E3" }}>{group}</strong>!
            <br />
            Hope this is your bias! 💕
          </p>
        </div>

        {/* Action buttons */}
        <div className="w-full flex flex-col gap-3 animate-slide_up delay-500">
          {/* Share button */}
          <button
            onClick={handleShare}
            className="w-full rounded-2xl py-4 font-bold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #E5C4FF, #B8E0FF)",
              color: "#9B59FF",
              boxShadow: "0 8px 24px rgba(155, 89, 255, 0.25)",
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <span>📤</span>
              <span>Share Result</span>
            </span>
          </button>

          {/* Back to home */}
          <Link href="/" className="w-full">
            <button className="w-full btn-primary">
              <span className="flex items-center justify-center gap-2">
                <span>🏠</span>
                <span>Back to Home</span>
              </span>
            </button>
          </Link>

          {/* Try again */}
          <Link href="/group" className="w-full">
            <button
              className="w-full rounded-2xl py-4 font-bold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                border: "2px solid rgba(255, 183, 197, 0.4)",
                color: "#FF8FAB",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <span>🎁</span>
                <span>Open Another Box!</span>
              </span>
            </button>
          </Link>
        </div>

        {/* Share copy message */}
        {shareMsg && (
          <div
            className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold animate-slide_up"
            style={{ background: "#C4F5E0", color: "#2D8C5A" }}
          >
            {shareMsg}
          </div>
        )}

        {/* Footer note */}
        <p className="text-xs text-gray-300 mt-6 text-center font-semibold">
          All members had equal probability ✦ Made with 💕
        </p>
      </div>
    </main>
  );
}
