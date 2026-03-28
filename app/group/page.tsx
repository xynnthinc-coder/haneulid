"use client";
// app/group/page.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GROUPS } from "@/lib/groups";
import type { Group } from "@/lib/groups";
import GroupCard from "@/components/GroupCard";
import StarBackground from "@/components/StarBackground";
import ProgressSteps from "@/components/ProgressSteps";

export default function GroupSelectionPage() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    setIsNavigating(true);
    setTimeout(() => {
      router.push(`/payment?group=${group.id}`);
    }, 400);
  };

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      <StarBackground />

      <div className="relative z-10 max-w-md mx-auto w-full">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-400 transition-colors mb-6"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Home
        </Link>

        <ProgressSteps currentStep={1} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl font-black mb-2 animate-slide_up"
            style={{ color: "#2D2D2D", fontFamily: "var(--font-nunito)" }}
          >
            Select Your
            <span
              style={{
                display: "block",
                background: "linear-gradient(135deg, #FF8FAB, #B8E0FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Fave Group ✦
            </span>
          </h1>
          <p className="text-sm text-gray-400 font-semibold animate-slide_up delay-100">
            Which group's photocard do you want? 💌
          </p>
        </div>

        {/* Group Cards Grid */}
        <div className="grid grid-cols-1 gap-4">
          {GROUPS.map((group, index) => (
            <div
              key={group.id}
              className="animate-slide_up"
              style={{ animationDelay: `${0.1 + index * 0.1}s`, opacity: 0 }}
            >
              <GroupCard
                group={group}
                onSelect={handleGroupSelect}
                isSelected={selectedGroup?.id === group.id}
              />
            </div>
          ))}
        </div>

        {/* Info note */}
        <div
          className="mt-6 p-4 rounded-2xl text-center animate-slide_up delay-500"
          style={{
            background: "rgba(255, 255, 255, 0.6)",
            border: "1px solid rgba(255, 183, 197, 0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            🎲 All members have equal probability of appearing!
            <br />
            Every box is a true mystery surprise~
          </p>
        </div>

        {/* Loading overlay when navigating */}
        {isNavigating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(255, 245, 228, 0.8)", backdropFilter: "blur(8px)" }}>
            <div className="text-center">
              <div className="text-5xl mb-4 animate-bounce">🎁</div>
              <p className="font-bold text-gray-500">Opening shop...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
