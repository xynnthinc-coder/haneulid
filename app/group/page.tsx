"use client";
// app/group/page.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Gift, Sparkles } from "lucide-react";
import { GROUPS } from "@/lib/groups";
import type { Group } from "@/lib/groups";
import GroupCard from "@/components/GroupCard";
import StarBackground from "@/components/StarBackground";
import ProgressSteps from "@/components/ProgressSteps";

interface StockSummary {
  [groupId: string]: { total: number; available: number; outOfStock: number };
}

export default function GroupSelectionPage() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [stockSummary, setStockSummary] = useState<StockSummary>({});
  const [stockLoaded, setStockLoaded] = useState(false);

  useEffect(() => {
    fetchStockSummary();
  }, []);

  const fetchStockSummary = async () => {
    try {
      const res = await fetch("/api/photocards");
      const data = await res.json();
      if (data.success && data.summary) {
        setStockSummary(data.summary);
      }
    } catch (err) {}
    setStockLoaded(true);
  };

  const handleGroupSelect = (group: Group) => {
    // Check if group is sold out
    const summary = stockSummary[group.id];
    if (summary && summary.available === 0) return;

    setSelectedGroup(group);
    setIsNavigating(true);
    setTimeout(() => {
      router.push(`/payment?group=${group.id}`);
    }, 400);
  };

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      <StarBackground />

      <div className="relative z-10 max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto w-full">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-400 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Balik ke Beranda
        </Link>

        <ProgressSteps currentStep={1} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl font-extrabold mb-2 animate-slide_up tracking-tight text-gray-800 font-display"
          >
            Pilih
            <span
              style={{
                display: "block",
                background: "linear-gradient(135deg, #FF8FAB, #B8E0FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Grup Favorit Kamu
            </span>
          </h1>
          <p className="text-sm text-gray-500 font-bold animate-slide_up delay-100 mt-2">
            Photocard grup mana yang pengen kamu dapetin?
          </p>
        </div>

        {/* Collection link */}
        <div className="text-center mb-6 animate-slide_up delay-200">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(201, 168, 255, 0.2), rgba(255, 143, 171, 0.2))",
              color: "#9B59FF",
              border: "1px solid rgba(201, 168, 255, 0.3)",
            }}
          >
            <Sparkles size={14} />
            Lihat Semua Koleksi Member
          </Link>
        </div>

        {/* Group Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {GROUPS.map((group, index) => {
            const summary = stockSummary[group.id];
            return (
              <div
                key={group.id}
                className="animate-slide_up"
                style={{ animationDelay: `${0.1 + index * 0.08}s`, opacity: 0 }}
              >
                <GroupCard
                  group={group}
                  onSelect={handleGroupSelect}
                  isSelected={selectedGroup?.id === group.id}
                  availableCount={stockLoaded ? (summary?.available ?? 0) : undefined}
                  totalCount={stockLoaded ? (summary?.total ?? 0) : undefined}
                />
              </div>
            );
          })}
        </div>

        {/* Info note */}
        <div className="mt-6 p-4 rounded-2xl text-center animate-slide_up delay-500 max-w-sm mx-auto glass-card">
          <p className="text-xs text-gray-600 font-bold leading-relaxed">
            Semua member aktif punya peluang yang sama buat muncul!
            <br />
            Setiap box beneran mystery surprise.
          </p>
        </div>

        {/* Loading overlay when navigating */}
        {isNavigating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(255, 245, 228, 0.85)", backdropFilter: "blur(12px)" }}>
            <div className="text-center flex flex-col items-center">
              <div className="mb-4 text-pink-400 animate-bounce_gentle">
                <Gift size={48} strokeWidth={1.5} />
              </div>
              <p className="font-extrabold text-gray-600 tracking-wide uppercase text-sm">Lagi buka toko...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
