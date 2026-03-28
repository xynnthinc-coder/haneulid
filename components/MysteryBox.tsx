"use client";
// components/MysteryBox.tsx
import React, { useState } from "react";

interface MysteryBoxProps {
  index: number;
  onSelect: (index: number) => void;
  isSelected: boolean;
  isDisabled: boolean;
  isOpening: boolean;
}

export default function MysteryBox({
  index,
  onSelect,
  isSelected,
  isDisabled,
  isOpening,
}: MysteryBoxProps) {
  const [isHovered, setIsHovered] = useState(false);

  const boxColors = [
    { fill: "#FFB7C5", stroke: "#FF8FAB", ribbon: "#FFF5E4", bow: "#FFD6DF" },
    { fill: "#B8E0FF", stroke: "#7EC8E3", ribbon: "#FFF5E4", bow: "#D6EEFF" },
    { fill: "#E5C4FF", stroke: "#C49AFF", ribbon: "#FFF5E4", bow: "#F0D8FF" },
    { fill: "#C4F5E0", stroke: "#7ADDB8", ribbon: "#FFF5E4", bow: "#D8F7EB" },
    { fill: "#FFF1C1", stroke: "#FFD166", ribbon: "#FFF5E4", bow: "#FFF8DC" },
    { fill: "#FFB7C5", stroke: "#FF8FAB", ribbon: "#B8E0FF", bow: "#D6EEFF" },
  ];

  const color = boxColors[index % boxColors.length];

  return (
    <button
      onClick={() => !isDisabled && onSelect(index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isDisabled}
      className={`
        relative transition-all duration-300 cursor-pointer
        disabled:cursor-not-allowed disabled:opacity-40
        focus:outline-none focus:ring-4 focus:ring-pastel-pink focus:ring-offset-2
        rounded-2xl p-2
        ${isSelected && isOpening ? "animate-open_box" : ""}
        ${isHovered && !isDisabled ? "scale-110 -translate-y-2" : "scale-100"}
        ${!isDisabled ? "hover:drop-shadow-[0_8px_20px_rgba(255,143,171,0.5)]" : ""}
      `}
      style={{
        transition: "transform 0.2s ease, filter 0.2s ease",
      }}
      aria-label={`Mystery box ${index + 1}`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ width: "100%", maxWidth: "110px" }}
      >
        {/* Box body */}
        <rect
          x="15"
          y="58"
          width="90"
          height="52"
          rx="8"
          fill={color.fill}
          stroke={color.stroke}
          strokeWidth="2.5"
        />
        {/* Box lid */}
        <rect
          x="10"
          y="45"
          width="100"
          height="20"
          rx="7"
          fill={color.stroke}
          stroke={color.stroke}
          strokeWidth="2"
        />
        {/* Ribbon vertical on body */}
        <rect x="53" y="58" width="14" height="52" rx="3" fill={color.ribbon} opacity="0.85" />
        {/* Ribbon horizontal on lid */}
        <rect x="10" y="51" width="100" height="9" rx="3" fill={color.ribbon} opacity="0.85" />
        {/* Bow left */}
        <ellipse
          cx="46"
          cy="39"
          rx="17"
          ry="11"
          fill={color.bow}
          stroke={color.stroke}
          strokeWidth="1.5"
          transform="rotate(-20 46 39)"
        />
        {/* Bow right */}
        <ellipse
          cx="74"
          cy="39"
          rx="17"
          ry="11"
          fill={color.bow}
          stroke={color.stroke}
          strokeWidth="1.5"
          transform="rotate(20 74 39)"
        />
        {/* Bow center */}
        <circle cx="60" cy="45" r="7" fill={color.stroke} stroke={color.stroke} strokeWidth="1" />
        {/* Dot decoration on box */}
        <circle cx="38" cy="80" r="3" fill={color.ribbon} opacity="0.6" />
        <circle cx="82" cy="90" r="2.5" fill={color.ribbon} opacity="0.6" />
        {/* Question mark */}
        <text
          x="50"
          y="98"
          fontSize="20"
          fontWeight="bold"
          fill={color.stroke}
          opacity="0.5"
          fontFamily="sans-serif"
        >
          ?
        </text>
        {/* Hover sparkle */}
        {isHovered && (
          <>
            <path
              d="M105 20 L107 25 L112 27 L107 29 L105 34 L103 29 L98 27 L103 25 Z"
              fill="#FFF1C1"
              opacity="0.9"
            />
            <path
              d="M12 18 L14 22 L18 24 L14 26 L12 30 L10 26 L6 24 L10 22 Z"
              fill="#E5C4FF"
              opacity="0.9"
            />
          </>
        )}
      </svg>

      {/* Glow effect when hovered */}
      {isHovered && !isDisabled && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${color.fill}40, transparent)`,
            filter: "blur(8px)",
          }}
        />
      )}
    </button>
  );
}
