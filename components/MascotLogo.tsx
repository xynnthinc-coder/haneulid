"use client";
// components/MascotLogo.tsx
import React from "react";

interface MascotLogoProps {
  size?: number;
  animated?: boolean;
}

export default function MascotLogo({
  size = 120,
  animated = true,
}: MascotLogoProps) {
  return (
    <div
      className={animated ? "animate-float" : ""}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        {/* Gift box body */}
        <rect
          x="30"
          y="100"
          width="140"
          height="85"
          rx="12"
          fill="#FFB7C5"
          stroke="#FF8FAB"
          strokeWidth="3"
        />
        {/* Gift box lid */}
        <rect
          x="20"
          y="78"
          width="160"
          height="32"
          rx="10"
          fill="#FF8FAB"
          stroke="#FF5C8A"
          strokeWidth="3"
        />
        {/* Ribbon vertical */}
        <rect
          x="90"
          y="78"
          width="20"
          height="107"
          rx="4"
          fill="#FFF5E4"
          opacity="0.9"
        />
        {/* Ribbon horizontal */}
        <rect
          x="20"
          y="86"
          width="160"
          height="14"
          rx="4"
          fill="#FFF5E4"
          opacity="0.9"
        />
        {/* Bow left loop */}
        <ellipse
          cx="78"
          cy="65"
          rx="28"
          ry="18"
          fill="#FFD6DF"
          stroke="#FF8FAB"
          strokeWidth="2"
          transform="rotate(-25 78 65)"
        />
        {/* Bow right loop */}
        <ellipse
          cx="122"
          cy="65"
          rx="28"
          ry="18"
          fill="#FFD6DF"
          stroke="#FF8FAB"
          strokeWidth="2"
          transform="rotate(25 122 65)"
        />
        {/* Bow center */}
        <circle cx="100" cy="78" r="10" fill="#FF8FAB" stroke="#FF5C8A" strokeWidth="2" />
        {/* Star decorations on box */}
        <circle cx="60" cy="130" r="5" fill="#FFF5E4" opacity="0.8" />
        <circle cx="140" cy="150" r="4" fill="#FFF5E4" opacity="0.8" />
        <circle cx="75" cy="160" r="3" fill="#FFF5E4" opacity="0.6" />
        {/* Sparkles around the box */}
        <path
          d="M175 55 L178 62 L185 65 L178 68 L175 75 L172 68 L165 65 L172 62 Z"
          fill="#B8E0FF"
        />
        <path
          d="M22 40 L24 45 L29 47 L24 49 L22 54 L20 49 L15 47 L20 45 Z"
          fill="#E5C4FF"
        />
        <path
          d="M160 20 L162 25 L167 27 L162 29 L160 34 L158 29 L153 27 L158 25 Z"
          fill="#FFB7C5"
        />
        {/* Question mark on box */}
        <text x="88" y="152" fontSize="32" fontWeight="bold" fill="#FF8FAB" opacity="0.5">
          ?
        </text>
      </svg>
    </div>
  );
}
