"use client";
// app/page.tsx
import React from "react";
import Link from "next/link";
import MascotLogo from "@/components/MascotLogo";
import StarBackground from "@/components/StarBackground";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      <StarBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto w-full">
        {/* Badge */}
        <div
          className="mb-6 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase animate-slide_up"
          style={{
            background: "rgba(255, 183, 197, 0.3)",
            border: "1px solid rgba(255, 143, 171, 0.4)",
            color: "#FF5C8A",
            backdropFilter: "blur(8px)",
          }}
        >
          ✨ New Collection Available
        </div>

        {/* Mascot */}
        <div className="mb-6 animate-slide_up delay-100">
          <MascotLogo size={150} animated={true} />
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl font-black mb-2 leading-tight animate-slide_up delay-200"
          style={{
            color: "#2D2D2D",
            fontFamily: "var(--font-nunito)",
            textShadow: "0 2px 0 rgba(255, 143, 171, 0.3)",
          }}
        >
          Haneul
        </h1>
        <h2
          className="text-3xl sm:text-4xl font-black mb-3 animate-slide_up delay-200"
          style={{
            background: "linear-gradient(135deg, #FF8FAB, #B8E0FF, #E5C4FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Gacha Box ✦
        </h2>

        {/* Subtitle */}
        <p
          className="text-base font-semibold text-gray-500 mb-2 animate-slide_up delay-300"
          style={{ lineHeight: "1.6" }}
        >
          Open mystery blind boxes and
          <br />
          discover exclusive photocards!
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 animate-slide_up delay-400">
          {[
            { label: "Groups", value: "4" },
            { label: "Members", value: "35+" },
            { label: "Cards", value: "100%" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                border: "1px solid rgba(255, 183, 197, 0.3)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                className="font-black text-lg"
                style={{ color: "#FF5C8A" }}
              >
                {stat.value}
              </span>
              <span className="text-xs text-gray-400 font-semibold">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link href="/group" className="w-full animate-slide_up delay-500">
          <button
            className="w-full btn-primary text-xl py-5 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span>🎁</span>
              <span>START</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                transform: "skewX(-20deg)",
              }}
            />
          </button>
        </Link>
        
        {/* Redeem Token Button */}
        <Link href="/redeem" className="w-full mt-4 animate-slide_up delay-500">
          <button className="bg-white/50 hover:bg-white/80 border-2 border-pink-200 text-pink-500 font-bold text-lg py-4 rounded-full shadow-md transition-all duration-300 w-full relative overflow-hidden">
            <span className="flex items-center justify-center gap-2">
              <span>🎟️</span>
              <span>Redeem Token</span>
            </span>
          </button>
        </Link>

        {/* Fine print */}
        <p className="text-xs text-gray-400 mt-6 animate-slide_up delay-600">
          Equal probability for all photocards ✦ Each box is a surprise!
        </p>

        {/* Secret Admin Link */}
        <div className="mt-8 animate-slide_up delay-[700ms]">
          <Link href="/admin" className="text-[10px] text-gray-300 hover:text-pink-300 transition-colors uppercase tracking-widest font-bold">
            Admin Access
          </Link>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div
        className="absolute bottom-16 left-8 text-4xl animate-float"
        style={{ animationDelay: "0.5s", animationDuration: "4s" }}
      >
        💜
      </div>
      <div
        className="absolute top-16 right-8 text-3xl animate-float"
        style={{ animationDelay: "1s", animationDuration: "3.5s" }}
      >
        ⭐
      </div>
      <div
        className="absolute bottom-32 right-6 text-2xl animate-float"
        style={{ animationDelay: "1.5s", animationDuration: "5s" }}
      >
        🌸
      </div>
      <div
        className="absolute top-32 left-6 text-2xl animate-float"
        style={{ animationDelay: "0.8s", animationDuration: "4.5s" }}
      >
        ✨
      </div>
    </main>
  );
}
