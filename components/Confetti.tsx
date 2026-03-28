"use client";
// components/Confetti.tsx
import React, { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  shape: "circle" | "square" | "star";
}

const COLORS = ["#FFB7C5", "#B8E0FF", "#E5C4FF", "#FFF1C1", "#C4F5E0", "#FF8FAB", "#7EC8E3"];

export default function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 10 + 6,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        shape: (["circle", "square", "star"] as const)[Math.floor(Math.random() * 3)],
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => setPieces([]), 6000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active && pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0"
          style={{
            left: `${piece.x}%`,
            animation: `confetti_fall ${piece.duration}s ease-in ${piece.delay}s forwards`,
          }}
        >
          {piece.shape === "circle" && (
            <div
              className="rounded-full"
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
              }}
            />
          )}
          {piece.shape === "square" && (
            <div
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          )}
          {piece.shape === "star" && (
            <svg width={piece.size * 1.5} height={piece.size * 1.5} viewBox="0 0 24 24">
              <path
                d="M12 2L14.4 9.6H22L15.8 14.4L18.2 22L12 17.2L5.8 22L8.2 14.4L2 9.6H9.6L12 2Z"
                fill={piece.color}
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
