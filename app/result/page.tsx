"use client";
// app/result/page.tsx
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Share, Home, Gift, AlertCircle, CheckCircle } from "lucide-react";
import PhotocardResult from "@/components/PhotocardResult";
import Confetti from "@/components/Confetti";
import StarBackground from "@/components/StarBackground";

function ResultContent() {
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
    const text = `Aku barusan dapet photocard ${name} dari ${group} di K-Pop Gacha Box!`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Hasil K-Pop Gacha!", text });
        return; // Kalau share sukses, gak perlu copy
      }
    } catch (err) {
      // Share API might throw AbortError if user closes the share dialog, ignore it.
      if ((err as Error).name !== 'AbortError') {
        console.error("Error sharing:", err);
      }
      return; 
    }

    // Fallback to Clipboard API or execCommand (if over local network HTTP)
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-HTTPS local network testing
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setShareMsg("Berhasil disalin ke clipboard!");
      setTimeout(() => setShareMsg(""), 3000);
    } catch (err) {
      setShareMsg("Butuh HTTPS / localhost");
      setTimeout(() => setShareMsg(""), 3000);
    }
  };

  if (!name || !group) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-gray-300 mb-4" strokeWidth={1} />
          <p className="font-extrabold text-gray-500 mb-4 uppercase tracking-wide">Gak ada hasil yang ditampilkan</p>
          <Link href="/">
            <button className="btn-primary">Balik ke Beranda</button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 sm:py-12 overflow-hidden flex flex-col">
      <StarBackground />
      <Confetti active={showConfetti} />

      <div className="relative z-10 max-w-md md:max-w-xl lg:max-w-2xl mx-auto w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-6 animate-slide_up">
          <div
            className="inline-block mb-3 px-5 py-2 rounded-full text-sm font-extrabold tracking-widest uppercase"
            style={{
              background: "linear-gradient(135deg, #FF99B7, #E5C4FF)",
              color: "white",
              boxShadow: "0 4px 16px rgba(255, 153, 183, 0.3)",
            }}
          >
            KAMU DAPET
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight font-display"
            style={{
              background: "linear-gradient(135deg, #FF8FAB, #B8E0FF, #E5C4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {name}
          </h1>
          <p
            className="text-sm lg:text-base font-extrabold tracking-widest uppercase mt-2"
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

        <div
          className="w-full rounded-3xl p-5 mb-6 text-center animate-slide_up delay-400 shadow-sm glass-panel"
        >
          <p className="font-extrabold text-gray-800 text-lg lg:text-xl mb-1 mt-1 tracking-tight">
            Selamat!
          </p>
          <p className="text-sm lg:text-base text-gray-500 font-semibold leading-relaxed">
            Kamu berhasil dapet photocard <strong style={{ color: "#FF5C8A" }}>{name}</strong> dari <strong style={{ color: "#7EC8E3" }}>{group}</strong>.
            <br />
            Semoga ini bias kamu ya!
          </p>
        </div>

        {/* Action buttons */}
        <div className="w-full flex flex-col gap-3 animate-slide_up delay-500">
          {/* Share button */}
          <button
            onClick={handleShare}
            className="w-full rounded-full py-3.5 sm:py-4 font-extrabold text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #E5C4FF, #D6EEFF)",
              color: "#8B49FF",
              boxShadow: "0 8px 30px rgba(139, 73, 255, 0.2)",
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <Share size={20} strokeWidth={2.5} />
              <span>Bagikan Hasil</span>
            </span>
          </button>

          {/* Back to home */}
          <Link href="/" className="w-full">
            <button className="w-full btn-primary">
              <span className="flex items-center justify-center gap-2">
                <Home size={20} />
                <span>Balik ke Beranda</span>
              </span>
            </button>
          </Link>

          {/* Try again */}
          <Link href="/group" className="w-full">
            <button
              className="w-full rounded-full py-3.5 sm:py-4 font-extrabold text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_rgb(0,0,0,0.04)] glass-card text-pink-500"
            >
              <span className="flex items-center justify-center gap-2">
                <Gift size={20} />
                <span>Buka Box Lagi</span>
              </span>
            </button>
          </Link>
        </div>

        {/* Share copy message */}
        {shareMsg && (
          <div
            className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold animate-slide_up flex items-center justify-center gap-2 mx-auto"
            style={{ background: "#E8FDF3", color: "#2D8C5A", border: "1px solid #C4F5E0" }}
          >
            <CheckCircle size={16} />
            {shareMsg}
          </div>
        )}

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-6 text-center font-semibold">
          Semua member punya peluang yang sama ❆ Dibuat dengan penuh cinta
        </p>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}
