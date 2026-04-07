"use client";
// app/page.tsx
import React from "react";
import Link from "next/link";
import { Sparkles, Gift, Ticket } from "lucide-react";
import MascotLogo from "@/components/MascotLogo";
import StarBackground from "@/components/StarBackground";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      <StarBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-center md:gap-12 lg:gap-20 text-center md:text-left max-w-sm md:max-w-4xl lg:max-w-5xl mx-auto w-full">
        {/* Left Column (Mascot & Title) */}
        <div className="flex flex-col items-center md:items-start flex-1 w-full">
          {/* Badge */}
          <div className="mb-8 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase animate-slide_up inline-flex items-center gap-2 glass-card text-pink-500">
            <Sparkles size={14} className="text-pink-400" />
            Koleksi Baru Udah Dateng!
          </div>

          {/* Mascot */}
          <div className="mb-6 animate-slide_up delay-100 hidden md:block w-full text-left">
            <MascotLogo size={180} animated={true} />
          </div>
          <div className="mb-6 animate-slide_up delay-100 md:hidden">
            <MascotLogo size={150} animated={true} />
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-2 leading-tight animate-slide_up delay-200 text-gray-800 tracking-tight font-display"
          >
            Haneul
          </h1>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 animate-slide_up delay-200"
            style={{
              background: "linear-gradient(135deg, #FF8FAB, #B8E0FF, #E5C4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.01em"
            }}
          >
            Gacha Box
          </h2>

          {/* Subtitle */}
          <p
            className="text-base lg:text-lg font-semibold text-gray-500 mb-2 animate-slide_up delay-300 max-w-xs md:max-w-none"
            style={{ lineHeight: "1.6" }}
          >
            Buka blind box misterius dan temukan photocard eksklusif idolamu!
          </p>
        </div>

        {/* Right Column (Stats & Actions) */}
        <div className="flex flex-col items-center flex-1 w-full mt-8 md:mt-0 max-w-sm mx-auto">
          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 animate-slide_up delay-400 w-full">
            {[
              { label: "Grup", value: "5" },
              { label: "Member", value: "45+" },
              { label: "Kartu", value: "100%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center flex-1 px-4 py-4 rounded-2xl glass-card"
              >
                <span className="font-black text-xl lg:text-2xl text-gray-800">
                  {stat.value}
                </span>
                <span className="text-xs lg:text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link href="/group" className="w-full animate-slide_up delay-500">
            <button
              className="w-full btn-primary relative overflow-hidden group shadow-lg shadow-pink-200"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Gift size={20} />
                <span className="font-black tracking-wide">MULAI GACHA</span>
              </span>
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  transform: "skewX(-20deg)",
                }}
              />
            </button>
          </Link>
          
          <Link href="/redeem" className="w-full mt-4 animate-slide_up delay-500">
            <button className="glass-card hover:bg-white text-pink-500 font-bold text-base sm:text-lg py-3.5 sm:py-4 rounded-full transition-all duration-300 w-full flex items-center justify-center gap-2 hover:shadow-[0_8px_30px_rgba(255,183,197,0.3)]">
              <Ticket size={18} className="text-pink-400" />
              <span>Tukar Token</span>
            </button>
          </Link>

          <Link href="/collection" className="w-full mt-3 animate-slide_up delay-600">
            <button className="glass-card border-purple-200/50 hover:bg-white text-purple-500 font-bold text-base sm:text-lg py-3.5 sm:py-4 rounded-full transition-all duration-300 w-full flex items-center justify-center gap-2 hover:shadow-[0_4px_20px_rgba(201,168,255,0.3)]">
              <Sparkles size={18} className="text-purple-400" />
              <span>Lihat Koleksi</span>
            </button>
          </Link>

          {/* Fine print */}
          <p className="text-xs lg:text-sm text-gray-400 mt-6 animate-slide_up delay-600">
            Semua photocard punya peluang yang sama ✦ Setiap box pasti bikin kejutan!
          </p>  
        </div>
      </div>

    </main>
  );
}
