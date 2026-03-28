"use client";
// components/GroupCard.tsx
import React, { useState } from "react";
import { Group } from "@/lib/groups";

interface GroupCardProps {
  group: Group;
  onSelect: (group: Group) => void;
  isSelected?: boolean;
}

export default function GroupCard({ group, onSelect, isSelected }: GroupCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const gradients: Record<string, string> = {
    nct: "linear-gradient(135deg, #FFB7C5 0%, #FFD6DF 50%, #FFE8F0 100%)",
    seventeen: "linear-gradient(135deg, #B8E0FF 0%, #D6EEFF 50%, #EAF5FF 100%)",
    straykids: "linear-gradient(135deg, #E5C4FF 0%, #F0D8FF 50%, #F7EEFF 100%)",
    bts: "linear-gradient(135deg, #FFF1C1 0%, #FFF8DC 50%, #FFFAED 100%)",
  };

  return (
    <button
      onClick={() => onSelect(group)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative w-full text-left rounded-3xl overflow-hidden transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-offset-2
        ${isSelected ? "scale-105 ring-4" : ""}
        ${isHovered ? "scale-105 -translate-y-1" : "scale-100"}
      `}
      style={{
        background: gradients[group.id] || gradients.nct,
        boxShadow: isHovered
          ? `0 20px 40px ${group.color}60`
          : `0 8px 24px ${group.color}30`,
        border: `2px solid ${group.color}60`,
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
    >
      {/* Card content */}
      <div className="p-5">
        {/* Emoji + group name row */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{group.emoji}</span>
          <div>
            <h3
              className="font-black text-xl leading-tight"
              style={{ color: "#2D2D2D", fontFamily: "var(--font-nunito)" }}
            >
              {group.name}
            </h3>
            <p className="text-xs font-medium" style={{ color: group.accent }}>
              {group.members} members
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-gray-500 font-medium leading-relaxed">
          {group.tagline}
        </p>

        {/* Arrow indicator */}
        <div className="flex items-center justify-end mt-3">
          <div
            className={`rounded-full p-2 transition-all duration-300 ${isHovered ? "translate-x-1" : ""}`}
            style={{ background: `${group.color}40` }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={group.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Decorative dots */}
      <div
        className="absolute top-3 right-4 opacity-30"
        style={{ fontSize: "28px", color: group.color }}
      >
        ✦
      </div>

      {/* Subtle shine effect */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)",
        }}
      />
    </button>
  );
}
