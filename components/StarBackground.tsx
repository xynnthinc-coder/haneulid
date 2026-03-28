"use client";
// components/StarBackground.tsx
import React from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

const COLORS = ["#FFB7C5", "#B8E0FF", "#E5C4FF", "#FFF1C1", "#C4F5E0"];

export default function StarBackground() {
  const stars: Star[] = React.useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        >
          <svg
            width={star.size}
            height={star.size}
            viewBox="0 0 24 24"
            className="animate-sparkle opacity-60"
            style={{ animationDelay: `${star.delay}s` }}
          >
            <path
              d="M12 2L14.4 9.6H22L15.8 14.4L18.2 22L12 17.2L5.8 22L8.2 14.4L2 9.6H9.6L12 2Z"
              fill={star.color}
            />
          </svg>
        </div>
      ))}

      {/* Floating blobs */}
      <div
        className="absolute rounded-full opacity-20 blur-3xl animate-float"
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, #FFB7C5, #FFD6DF)",
          top: "-50px",
          right: "-80px",
          animationDuration: "6s",
        }}
      />
      <div
        className="absolute rounded-full opacity-15 blur-3xl animate-float"
        style={{
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, #B8E0FF, #D6EEFF)",
          bottom: "10%",
          left: "-60px",
          animationDuration: "8s",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute rounded-full opacity-10 blur-3xl animate-float"
        style={{
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, #E5C4FF, #F0D8FF)",
          top: "40%",
          right: "10%",
          animationDuration: "7s",
          animationDelay: "1s",
        }}
      />
    </div>
  );
}
