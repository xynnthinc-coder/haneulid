"use client";
// components/PhotocardResult.tsx
import React, { useEffect, useState } from "react";

interface PhotocardResultProps {
  name: string;
  group: string;
  image: string;
  isRevealing?: boolean;
}

export default function PhotocardResult({
  name,
  group,
  image,
  isRevealing = false,
}: PhotocardResultProps) {
  const [showCard, setShowCard] = useState(!isRevealing);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isRevealing) {
      const timer = setTimeout(() => setShowCard(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isRevealing]);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Group-based gradient colors
  const groupGradients: Record<string, string> = {
    NCT: "from-pink-200 via-pink-100 to-rose-50",
    SEVENTEEN: "from-blue-200 via-blue-100 to-sky-50",
    "STRAY KIDS": "from-purple-200 via-purple-100 to-violet-50",
    BTS: "from-yellow-200 via-yellow-100 to-amber-50",
  };

  const gradient = groupGradients[group] || "from-pink-200 via-pink-100 to-rose-50";

  return (
    <div
      className={`
        relative mx-auto
        ${showCard ? "animate-reveal_card" : "opacity-0"}
      `}
      style={{ width: "220px", maxWidth: "100%" }}
    >
      {/* Card container */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(255,143,171,0.4)]"
        style={{
          background: "linear-gradient(135deg, #FFF5E4 0%, #FFD6DF 100%)",
          border: "3px solid rgba(255,143,171,0.4)",
          aspectRatio: "2/3",
        }}
      >
        {/* Card inner gradient bg */}
        <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-80`} />

        {/* Holographic shimmer effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />

        {/* Photo area */}
        <div className="absolute inset-0 flex flex-col">
          {/* Top decorative strip */}
          <div className="h-2 bg-gradient-to-r from-pastel-pink via-pastel-blue to-pastel-purple opacity-60" />

          {/* Image */}
          <div className="flex-1 relative overflow-hidden">
            {!imageError ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              /* Placeholder when image not found */
              <div
                className={`w-full h-full bg-gradient-to-b ${gradient} flex items-center justify-center`}
              >
                <div className="text-center">
                  <div
                    className="mx-auto mb-3 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "linear-gradient(135deg, #FFB7C5, #B8E0FF)",
                    }}
                  >
                    {initials}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Photo coming soon</span>
                </div>
              </div>
            )}
          </div>

          {/* Name card footer */}
          <div
            className="px-4 py-3 text-center"
            style={{
              background: "rgba(255,245,228,0.9)",
              backdropFilter: "blur(8px)",
              borderTop: "1px solid rgba(255,143,171,0.2)",
            }}
          >
            <p
              className="font-bold text-lg tracking-wide"
              style={{ color: "#FF5C8A", fontFamily: "var(--font-nunito)" }}
            >
              {name}
            </p>
            <p
              className="text-xs font-semibold tracking-widest uppercase mt-0.5"
              style={{ color: "#7EC8E3" }}
            >
              {group}
            </p>
          </div>

          {/* Bottom decorative strip */}
          <div className="h-2 bg-gradient-to-r from-pastel-blue via-pastel-pink to-pastel-yellow opacity-60" />
        </div>

        {/* Corner star decorations */}
        <div className="absolute top-3 right-3 text-yellow-300 text-xs">⭐</div>
        <div className="absolute top-3 left-3 text-pink-300 text-xs">✨</div>
      </div>

      {/* Glow behind card */}
      <div
        className="absolute inset-0 rounded-3xl -z-10 blur-xl opacity-40"
        style={{ background: "radial-gradient(circle, #FFB7C5, #B8E0FF)" }}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
