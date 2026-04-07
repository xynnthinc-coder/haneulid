"use client";
// app/collection/[groupId]/page.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, CheckCircle, XCircle, ShoppingBag, Sparkles } from "lucide-react";
import StarBackground from "@/components/StarBackground";
import { GROUPS, getGroupById } from "@/lib/groups";

interface Photocard {
  id: string;
  groupId: string;
  name: string;
  image: string;
  stock: number;
}

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const group = getGroupById(groupId);

  const [photocards, setPhotocards] = useState<Photocard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotocards();
  }, [groupId]);

  const fetchPhotocards = async () => {
    try {
      const res = await fetch(`/api/photocards?group=${encodeURIComponent(groupId)}`);
      const data = await res.json();
      if (data.success) {
        setPhotocards(data.photocards || []);
      }
    } catch (err) {}
    setLoading(false);
  };

  if (!group) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle size={64} className="text-gray-300 mx-auto mb-4" strokeWidth={1} />
          <h2 className="text-xl font-bold text-gray-600 mb-4">Grup tidak ditemukan</h2>
          <Link href="/collection">
            <button className="btn-primary">Ke Halaman Koleksi</button>
          </Link>
        </div>
      </main>
    );
  }

  const available = photocards.filter((p) => p.stock > 0).length;
  const soldOut = photocards.filter((p) => p.stock === 0).length;
  const totalStock = photocards.reduce((s, p) => s + p.stock, 0);

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      <StarBackground />

      <div className="relative z-10 max-w-md sm:max-w-2xl md:max-w-4xl mx-auto w-full">
        {/* Back */}
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-400 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Semua Koleksi
        </Link>

        {/* Group Hero */}
        <div
          className="glass-panel rounded-3xl overflow-hidden mb-6 animate-slide_up"
          style={{
            border: `1px solid ${group.color}30`,
            boxShadow: `0 8px 32px ${group.color}20`,
          }}
        >
          {/* Accent bar */}
          <div className="h-2" style={{ background: `linear-gradient(90deg, ${group.color}, ${group.accent})` }} />

          <div className="p-6 flex flex-col sm:flex-row items-center gap-5">
            {/* Group Image */}
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0"
              style={{
                border: `3px solid ${group.color}40`,
                boxShadow: `0 8px 24px ${group.color}25`,
              }}
            >
              <img
                src={group.image}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{ background: `${group.color}20`, color: group.accent }}
              >
                <Sparkles size={12} />
                Koleksi
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 font-display">
                {group.name}
              </h1>
              <p className="text-sm font-medium" style={{ color: group.accent }}>{group.tagline}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 sm:gap-4">
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: group.accent }}>{available}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Tersedia</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-black text-gray-800">{totalStock}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Stok</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-black text-red-500">{soldOut}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Habis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-gray-300 mb-4 animate-bounce_gentle" strokeWidth={1} />
            <p className="text-sm font-bold text-gray-400">Lagi ngeload member...</p>
          </div>
        )}

        {/* Members Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {photocards.map((card, index) => {
              const isAvailable = card.stock > 0;
              const isLow = card.stock > 0 && card.stock <= 3;

              return (
                <div
                  key={card.id}
                  className="animate-slide_up"
                  style={{ animationDelay: `${0.1 + index * 0.05}s`, opacity: 0 }}
                >
                  <div
                    className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{
                      border: `1px solid ${isAvailable ? group.color : "#EF4444"}30`,
                      boxShadow: `0 4px 16px ${isAvailable ? group.color : "rgba(239,68,68,0.2)"}15`,
                      filter: !isAvailable ? "grayscale(0.5)" : "none",
                    }}
                  >
                    {/* Photo */}
                    <div className="relative bg-white/40 flex items-center justify-center overflow-hidden" style={{ aspectRatio: "3/4" }}>
                      <span className="text-6xl font-black font-display uppercase tracking-widest" style={{ color: `${group.accent}40` }}>{card.name.charAt(0)}</span>
                      <img
                        src={card.image}
                        alt={card.name}
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />

                      {/* Sold Out overlay */}
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
                          <div
                            className="px-4 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider"
                            style={{
                              background: "rgba(239, 68, 68, 0.9)",
                              color: "white",
                              transform: "rotate(-8deg)",
                              boxShadow: "0 2px 8px rgba(239,68,68,0.4)",
                            }}
                          >
                            Habis
                          </div>
                        </div>
                      )}

                      {/* Low stock */}
                      {isLow && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-400 text-white animate-pulse">
                            Sedikit
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h4 className="font-bold text-sm text-gray-800 mb-1 truncate">{card.name}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {isAvailable ? (
                            <CheckCircle size={13} className="text-green-500" strokeWidth={2.5} />
                          ) : (
                            <XCircle size={13} className="text-red-400" strokeWidth={2.5} />
                          )}
                          <span
                            className={`text-[11px] font-bold ${isAvailable ? "text-green-600" : "text-red-500"}`}
                          >
                            {isAvailable ? "Tersedia" : "Habis"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShoppingBag size={12} className="text-gray-400" />
                          <span
                            className={`text-xs font-black ${
                              card.stock === 0 ? "text-red-500" : isLow ? "text-amber-600" : "text-gray-800"
                            }`}
                          >
                            {card.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        {!loading && available > 0 && (
          <div className="mt-8 text-center animate-slide_up delay-500">
            <Link href={`/payment?group=${groupId}`}>
              <button className="btn-primary w-full sm:w-auto">
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag size={20} />
                  Gacha {group.name} Sekarang!
                </span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
