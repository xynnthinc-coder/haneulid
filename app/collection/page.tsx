"use client";
// app/collection/page.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Package, Users, ChevronRight, Sparkles } from "lucide-react";
import StarBackground from "@/components/StarBackground";
import { GROUPS } from "@/lib/groups";

interface Photocard {
  id: string;
  groupId: string;
  name: string;
  image: string;
  stock: number;
}

interface StockSummary {
  [groupId: string]: { total: number; available: number; outOfStock: number };
}

const GROUP_LABELS: Record<string, { name: string; color: string; accent: string }> = {
  treasure: { name: "TREASURE", color: "#FFD166", accent: "#F5A623" },
  nctdream: { name: "NCT DREAM", color: "#7EC8E3", accent: "#4EADE3" },
  nct127: { name: "NCT 127", color: "#FF8FAB", accent: "#FF5C8A" },
  seventeen: { name: "SEVENTEEN", color: "#C9A8FF", accent: "#9B59FF" },
  enhypen: { name: "ENHYPEN", color: "#A8E6CF", accent: "#56C596" },
};

export default function CollectionPage() {
  const [photocards, setPhotocards] = useState<Photocard[]>([]);
  const [summary, setSummary] = useState<StockSummary>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await fetch("/api/photocards");
      const data = await res.json();
      if (data.success) {
        setPhotocards(data.photocards || []);
        setSummary(data.summary || {});
      }
    } catch (err) {}
    setLoading(false);
  };

  // Filter by search
  const filteredPhotocards = search
    ? photocards.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (GROUP_LABELS[p.groupId]?.name || p.groupId).toLowerCase().includes(search.toLowerCase())
      )
    : photocards;

  // Stats
  const totalCards = photocards.length;
  const totalAvailable = photocards.filter((p) => p.stock > 0).length;
  const totalStock = photocards.reduce((s, p) => s + p.stock, 0);

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      <StarBackground />

      <div className="relative z-10 max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto w-full">
        {/* Back */}
        <Link
          href="/group"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-400 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Pilih Grup
        </Link>

        {/* Header */}
        <div className="text-center mb-6 animate-slide_up">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: "rgba(201, 168, 255, 0.2)",
              border: "1px solid rgba(201, 168, 255, 0.3)",
              color: "#9B59FF",
            }}
          >
            <Sparkles size={14} />
            Koleksi
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800 font-display"
          >
            Photocard
            <span
              style={{
                display: "block",
                background: "linear-gradient(135deg, #C9A8FF, #FF8FAB)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Koleksi
            </span>
          </h1>
          <p className="text-sm text-gray-400 font-semibold mt-2">
            Lihat semua member & ketersediaan stok photocard.
          </p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto animate-slide_up delay-100">
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-xl font-black text-gray-800">{totalCards}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Member</p>
            </div>
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-xl font-black text-green-600">{totalAvailable}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tersedia</p>
            </div>
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-xl font-black" style={{ color: "#9B59FF" }}>{totalStock}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Stok</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 animate-slide_up delay-200">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama member atau grup..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all text-gray-800 glass-input"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-purple-300 mb-4 animate-bounce_gentle" strokeWidth={1} />
            <p className="text-sm font-bold text-gray-400">Lagi ngeload koleksi...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && photocards.length === 0 && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" strokeWidth={1} />
            <h3 className="text-lg font-bold text-gray-600 mb-2">Belum Ada Koleksi</h3>
            <p className="text-sm text-gray-400">Data photocard belum tersedia.</p>
          </div>
        )}

        {/* Group Cards */}
        {!loading && photocards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {GROUPS.map((group, index) => {
              const groupInfo = GROUP_LABELS[group.id] || { name: group.id.toUpperCase(), color: "#999", accent: "#666" };
              const groupSummary = summary[group.id];
              const groupCards = filteredPhotocards.filter((p) => p.groupId === group.id);

              if (search && groupCards.length === 0) return null;

              const available = groupSummary?.available ?? 0;
              const total = groupSummary?.total ?? 0;
              const isSoldOut = total > 0 && available === 0;

              return (
                <Link
                  key={group.id}
                  href={`/collection/${group.id}`}
                  className="block animate-slide_up group"
                  style={{ animationDelay: `${0.15 + index * 0.08}s`, opacity: 0 }}
                >
                  <div
                    className="glass-panel rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                    style={{
                      border: `1px solid ${groupInfo.color}30`,
                      boxShadow: `0 4px 20px ${groupInfo.color}15`,
                    }}
                  >
                    {/* Top accent */}
                    <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${groupInfo.color}, ${groupInfo.accent})` }} />

                    <div className="p-5">
                      {/* Group image + name */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-white/50 flex items-center justify-center font-display font-black text-xl"
                          style={{ border: `2px solid ${groupInfo.color}40`, color: groupInfo.color }}
                        >
                          <span className="uppercase">{group.name.charAt(0)}</span>
                          <img
                            src={group.image}
                            alt={group.name}
                            className="absolute inset-0 w-full h-full object-cover z-10"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-gray-800 text-lg leading-tight">{group.name}</h3>
                          <p className="text-xs font-medium" style={{ color: groupInfo.accent }}>{group.tagline}</p>
                        </div>
                        {isSoldOut ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-600">
                            Habis
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                            style={{ background: `${groupInfo.color}20`, color: groupInfo.accent }}
                          >
                            {available}/{total}
                          </span>
                        )}
                      </div>

                      {/* Member preview - show first 5 faces */}
                      <div className="flex items-center gap-1 mb-3">
                        {groupCards.slice(0, 5).map((card, i) => (
                          <div
                            key={card.id}
                            className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/50 flex items-center justify-center font-display font-black text-xs"
                            style={{
                              border: `1.5px solid ${card.stock > 0 ? groupInfo.color : "#EF4444"}40`,
                              color: groupInfo.color,
                              opacity: card.stock === 0 ? 0.4 : 1,
                              marginLeft: i > 0 ? "-4px" : "0",
                              zIndex: 5 - i,
                            }}
                          >
                            <span className="uppercase">{card.name.charAt(0)}</span>
                            <img
                              src={card.image}
                              alt={card.name}
                              className="absolute inset-0 w-full h-full object-cover z-10"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        ))}
                        {groupCards.length > 5 && (
                          <span className="text-[10px] font-bold text-gray-400 ml-1">
                            +{groupCards.length - 5}
                          </span>
                        )}
                      </div>

                      {/* Stock bar */}
                      <div className="mb-3">
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: `${groupInfo.color}15` }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: total > 0 ? `${(available / total) * 100}%` : "0%",
                              background: isSoldOut
                                ? "#EF4444"
                                : `linear-gradient(90deg, ${groupInfo.color}, ${groupInfo.accent})`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Bottom link */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                          <Users size={13} />
                          <span>{total} member</span>
                        </div>
                        <div
                          className="flex items-center gap-1 text-xs font-bold group-hover:translate-x-1 transition-transform"
                          style={{ color: groupInfo.accent }}
                        >
                          <span>Lihat Detail</span>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
