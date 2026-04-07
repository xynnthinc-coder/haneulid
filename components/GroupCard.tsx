"use client";
// components/GroupCard.tsx
import React, { useState } from "react";
import { Group } from "@/lib/groups";
import { Users, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";

interface GroupCardProps {
  group: Group;
  onSelect: (group: Group) => void;
  isSelected?: boolean;
  availableCount?: number;
  totalCount?: number;
}

export default function GroupCard({ group, onSelect, isSelected, availableCount, totalCount }: GroupCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasStockInfo = availableCount !== undefined && totalCount !== undefined;
  const isSoldOut = hasStockInfo && availableCount === 0;
  const isLowStock = hasStockInfo && availableCount > 0 && availableCount <= 2;
  const stockPercent = hasStockInfo && totalCount > 0 ? (availableCount / totalCount) * 100 : 100;

  return (
    <div className="relative">
      <button
        onClick={() => !isSoldOut && onSelect(group)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          group relative w-full text-left rounded-2xl overflow-hidden
          focus:outline-none focus:ring-4 focus:ring-offset-2
          ${isSelected ? "ring-4" : ""}
          ${isSoldOut ? "cursor-not-allowed" : "cursor-pointer"}
        `}
        style={{
          aspectRatio: "3 / 4",
          transform: isHovered && !isSoldOut ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
          boxShadow: isHovered && !isSoldOut
            ? `0 24px 48px ${group.color}50, 0 0 0 1px ${group.color}30`
            : `0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)`,
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          filter: isSoldOut ? "grayscale(0.6)" : "none",
        }}
        disabled={isSoldOut}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          {!imageError ? (
            <img
              src={group.image}
              alt={group.name}
              className="w-full h-full object-cover"
              style={{
                transform: isHovered && !isSoldOut ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)",
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${group.color}40 0%, ${group.accent}30 100%)`,
              }}
            >
              <span
                className="font-black text-4xl sm:text-5xl tracking-tighter opacity-20"
                style={{ color: group.accent }}
              >
                {group.name}
              </span>
            </div>
          )}
        </div>

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to top,
              rgba(0,0,0,0.85) 0%,
              rgba(0,0,0,0.5) 35%,
              rgba(0,0,0,0.1) 60%,
              transparent 100%
            )`,
          }}
        />

        {/* Sold Out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center z-20"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            <div
              className="px-5 py-2 rounded-full font-black text-sm uppercase tracking-wider"
              style={{
                background: "rgba(239, 68, 68, 0.9)",
                color: "white",
                transform: "rotate(-12deg)",
                boxShadow: "0 4px 16px rgba(239, 68, 68, 0.4)",
              }}
            >
              Habis
            </div>
          </div>
        )}

        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${group.color}, ${group.accent})`,
            opacity: isHovered ? 1 : 0.6,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Selected indicator badge */}
        {isSelected && (
          <div
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center z-10"
            style={{ background: group.accent }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {/* Content overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
          {/* Group name */}
          <h3
            className="font-black text-lg sm:text-xl tracking-wide text-white mb-1 leading-tight"
            style={{ fontFamily: "var(--font-nunito)", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
          >
            {group.name}
          </h3>

          {/* Tagline */}
          <p
            className="text-[11px] sm:text-xs font-medium mb-3 leading-relaxed"
            style={{
              color: `${group.color}`,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            {group.tagline}
          </p>

          {/* Stock progress bar */}
          {hasStockInfo && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-white/70">
                  {availableCount}/{totalCount} tersedia
                </span>
                {isLowStock && (
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider animate-pulse">
                    Stok sedikit!
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stockPercent}%`,
                    background: isSoldOut
                      ? "#EF4444"
                      : isLowStock
                        ? "#F59E0B"
                        : `linear-gradient(90deg, ${group.color}, ${group.accent})`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Bottom row: members + arrow */}
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold"
              style={{
                background: `${group.accent}30`,
                color: group.color,
                backdropFilter: "blur(8px)",
              }}
            >
              <Users size={12} strokeWidth={2.5} />
              <span>{group.members} member</span>
            </div>

            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: `${group.accent}40`,
                transform: isHovered && !isSoldOut ? "translateX(4px)" : "translateX(0)",
                transition: "all 0.3s ease",
                backdropFilter: "blur(8px)",
              }}
            >
              <ChevronRight
                size={16}
                strokeWidth={2.5}
                style={{ color: group.color }}
              />
            </div>
          </div>
        </div>

        {/* Hover shimmer effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
            opacity: isHovered && !isSoldOut ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Colored glow on hover at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${group.color}15, transparent)`,
            opacity: isHovered && !isSoldOut ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
      </button>

      {/* View Detail Button - below card */}
      <Link
        href={`/collection/${group.id}`}
        className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
        style={{
          background: `${group.color}20`,
          color: group.accent,
          border: `1px solid ${group.color}30`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Eye size={13} strokeWidth={2.5} />
        Cek Detail
      </Link>
    </div>
  );
}
