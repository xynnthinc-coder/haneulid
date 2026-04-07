"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Ticket, Loader2 } from "lucide-react";
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
      setErrorMsg("Masukkan token kamu dulu dong!");
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
          setErrorMsg("Token ini udah pernah dipakai.");
        } else if (data.status === "pending") {
          setErrorMsg("Token ini masih menunggu verifikasi admin.");
        } else {
          setErrorMsg("Token tidak valid. Cek lagi dan coba ulang ya.");
        }
      }
    } catch (err) {
      setErrorMsg("Koneksi bermasalah. Coba lagi ya.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 sm:py-12 overflow-hidden flex flex-col items-center justify-center">
      <StarBackground />
      
      <div className="relative z-10 w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto flex flex-col items-center animate-slide_up">
        <Link href="/" className="mb-6 lg:mb-8 opacity-80 hover:opacity-100 transition-opacity">
          <MascotLogo size={120} animated={false} />
        </Link>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 text-gray-800 text-center drop-shadow-sm tracking-tight font-display">
          Tukar Token
        </h1>
        <p className="text-gray-500 font-semibold text-center mb-8 lg:mb-10 text-sm lg:text-base">
          Udah dapet token dari WhatsApp? Masukkan di bawah.
        </p>

        <form onSubmit={handleRedeem} className="w-full glass-panel rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-4">
            <label htmlFor="token" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1 mt-1">
              Gacha Token
            </label>
              <input
              id="token"
              type="text"
              placeholder="contoh: GACHA-X7Y8Z9"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl text-lg font-bold outline-none uppercase text-center tracking-widest text-pink-500 glass-input focus:ring-2 focus:ring-pink-300 transition-all border-pink-200"
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
            className="w-full btn-primary mt-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isValidating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Lagi verifikasi...</span>
                </>
              ) : (
                <>
                  <Ticket size={20} />
                  <span>Tukar Sekarang</span>
                </>
              )}
            </span>
          </button>
        </form>

        <Link href="/group" className="mt-8 text-sm font-bold text-gray-400 hover:text-pink-400 transition-colors">
          Belum punya token? Beli di sini!
        </Link>
      </div>
    </main>
  );
}
