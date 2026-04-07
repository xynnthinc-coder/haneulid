"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function StoreStatusOverlay() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(true);
  const [operationalHours, setOperationalHours] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we're on the admin page, we don't need to block ourselves
    if (pathname?.startsWith("/admin")) {
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.setting) {
          setIsActive(data.setting.isActive);
          setOperationalHours(data.setting.operationalHours);
        }
      } catch (err) {
        console.error("Failed to fetch store status");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    // Poll every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [pathname]);

  if (loading || isActive || pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Heavy blur backdrop */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl"></div>
      
      {/* Modal Content */}
      <div className="relative bg-white/80 border border-white/50 shadow-2xl rounded-3xl p-8 max-w-md w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner text-4xl">
          💤
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Toko Sedang Tutup</h2>
        <p className="text-gray-600 mb-6 font-medium">
          Saat ini server sedang istirahat. Kamu belum bisa melakukan transaksi. Silakan kembali pada jam operasional kami:
        </p>
        
        <div className="bg-pink-50 border border-pink-200 text-pink-600 font-black px-6 py-3 rounded-2xl w-full text-xl mb-6 shadow-sm">
          {operationalHours}
        </div>
        
        <p className="text-sm text-gray-400 font-medium">
          Catatan: Pesanan di luar jam kerja akan diproses berdasarkan antrean.
        </p>
      </div>
    </div>
  );
}
