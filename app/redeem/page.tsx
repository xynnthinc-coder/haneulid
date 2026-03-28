"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StarBackground from "@/components/StarBackground";
import MascotLogo from "@/components/MascotLogo";

export default function RedeemPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setErrorMsg("Please enter your token first!");
      return;
    }

    setIsValidating(true);
    setErrorMsg("");

    try {
      // Validate token without using it
      const res = await fetch(`/api/gacha?token=${encodeURIComponent(token.trim().toUpperCase())}`);
      const data = await res.json();

      if (data.valid) {
        // Redirect to gacha page if valid
        router.push(`/gacha?token=${encodeURIComponent(token.trim().toUpperCase())}`);
      } else {
        if (data.status === "used") {
          setErrorMsg("This token has already been used. 😢");
        } else if (data.status === "pending") {
          setErrorMsg("This token is still pending admin verification.");
        } else {
          setErrorMsg("Invalid token. Please check and try again.");
        }
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 sm:py-12 overflow-hidden flex flex-col items-center justify-center">
      <StarBackground />
      
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center animate-slide_up">
        <Link href="/" className="mb-6 opacity-80 hover:opacity-100 transition-opacity">
          <MascotLogo size={100} animated={false} />
        </Link>
        
        <h1 className="text-3xl sm:text-4xl font-black mb-2 text-gray-800 text-center" style={{ fontFamily: "var(--font-nunito)" }}>
          Redeem Token
        </h1>
        <p className="text-gray-500 font-semibold text-center mb-8 text-sm">
          Got your token from WhatsApp? Enter it below! 🎁
        </p>

        <form onSubmit={handleRedeem} className="w-full bg-white/70 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 shadow-xl">
          <div className="mb-4">
            <label htmlFor="token" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1 mt-1">
              Gacha Token
            </label>
            <input
              id="token"
              type="text"
              placeholder="e.g. GACHA-X7Y8Z9"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl text-lg font-bold outline-none uppercase text-center tracking-widest"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "2px solid rgba(255,183,197,0.5)",
                color: "#FF5C8A",
              }}
              disabled={isValidating}
            />
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-500 text-xs font-semibold p-3 rounded-xl mb-4 text-center border border-red-100">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isValidating || !token.trim()}
            className="w-full btn-primary py-4 text-lg mt-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isValidating ? (
                <>⏳ Verifying...</>
              ) : (
                <>
                  <span>✨</span>
                  <span>Redeem Now</span>
                </>
              )}
            </span>
          </button>
        </form>

        <Link href="/group" className="mt-8 text-sm font-bold text-gray-400 hover:text-pink-400 transition-colors">
          Don't have a token? Buy one here!
        </Link>
      </div>
    </main>
  );
}
