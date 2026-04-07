"use client";
// app/gacha/page.tsx
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, AlertCircle, Gift, Info } from "lucide-react";
import MysteryBox from "@/components/MysteryBox";
import StarBackground from "@/components/StarBackground";
import ProgressSteps from "@/components/ProgressSteps";

type GachaState = "validating" | "ready" | "selecting" | "opening" | "result" | "error" | "invalid";

interface GachaResult {
  name: string;
  group: string;
  groupId: string;
  image: string;
}

function GachaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [state, setState] = useState<GachaState>("validating");
  const [groupName, setGroupName] = useState("");
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [result, setResult] = useState<GachaResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [shakeAll, setShakeAll] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setState("invalid");
      setErrorMsg("Tokennya gak ada nih. Selesaikan pembayaran dulu ya.");
      return;
    }
    validateToken();
  }, [token]);

  // Periodic box shake animation
  useEffect(() => {
    if (state !== "ready") return;
    const interval = setInterval(() => {
      setShakeAll(true);
      setTimeout(() => setShakeAll(false), 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [state]);

  const validateToken = async () => {
    try {
      const res = await fetch(`/api/gacha?token=${encodeURIComponent(token)}`);
      const data = await res.json();

      if (!data.valid) {
        if (data.status === "used") {
          setErrorMsg("Token ini udah kepake. Setiap box cuma bisa dibuka sekali! 😢");
        } else if (data.status === "pending") {
          setErrorMsg("Pembayaran belum diverifikasi. Upload bukti pembayaran kamu dulu ya.");
        } else {
          setErrorMsg(data.error ?? "Token tidak valid. Selesaikan pembayaran dulu ya.");
        }
        setState("invalid");
      } else {
        setGroupName(data.group?.toUpperCase() ?? "");
        setState("ready");
      }
    } catch (err) {
      setErrorMsg("Koneksi bermasalah. Coba lagi ya.");
      setState("error");
    }
  };

  const handleBoxSelect = async (index: number) => {
    if (state !== "ready") return;

    setSelectedBox(index);
    setState("selecting");

    // Shake animation before opening
    setTimeout(async () => {
      setState("opening");

      try {
        const res = await fetch("/api/gacha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (data.success) {
          // Wait for opening animation then show result
          setTimeout(() => {
            setResult(data.result);
            // Navigate to result page with data
            const params = new URLSearchParams({
              name: data.result.name,
              group: data.result.group,
              groupId: data.result.groupId,
              image: data.result.image,
            });
            router.push(`/result?${params.toString()}`);
          }, 800);
        } else {
          setErrorMsg(data.error ?? "Gagal membuka box.");
          setState("error");
        }
      } catch (err) {
        setErrorMsg("Koneksi bermasalah. Coba lagi ya.");
        setState("error");
      }
    }, 400);
  };

  // ===== VALIDATING =====
  if (state === "validating") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Search size={56} className="mx-auto text-pink-400 mb-6 animate-pulse" strokeWidth={1.5} />
          <p className="font-extrabold text-gray-500 tracking-wide uppercase">Lagi ngecek token kamu...</p>
          <div className="flex gap-2 justify-center mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full animate-bounce"
                style={{ background: "#FFB7C5", animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ===== INVALID / ERROR =====
  if (state === "invalid" || state === "error") {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-6">
        <StarBackground />
        <div className="relative z-10 text-center max-w-sm">
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" strokeWidth={1.5} />
          <h2 className="text-2xl font-black text-gray-600 mb-3">
            {state === "invalid" ? "Akses Ditolak" : "Ada yang Salah Nih"}
          </h2>
          <p className="text-sm text-gray-400 font-semibold mb-6 leading-relaxed">
            {errorMsg}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/group">
              <button className="w-full btn-primary">Mulai Dari Awal</button>
            </Link>
            {state === "error" && (
              <button
                onClick={() => { setState("validating"); validateToken(); }}
                className="w-full btn-secondary"
              >
                Coba Lagi
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      <StarBackground />

      <div className="relative z-10 max-w-md md:max-w-2xl lg:max-w-4xl mx-auto w-full">
        <ProgressSteps currentStep={3} />

        {/* Header */}
        <div className="text-center mb-2">
          <div
            className="inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: "rgba(255, 183, 197, 0.3)",
              border: "1px solid rgba(255, 143, 171, 0.4)",
              color: "#FF5C8A",
            }}
          >
            Token: {token}
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold mb-1 animate-slide_up tracking-tight"
            style={{ color: "#2D2D2D" }}
          >
            Pilih Boxmu
          </h1>
          <p className="text-sm text-gray-400 font-semibold animate-slide_up delay-100">
            {groupName && `Koleksi ${groupName} · `}Pilih satu mystery box.
          </p>
        </div>

        {/* Hint text */}
        <div
          className="mx-auto mb-6 px-4 py-3 rounded-2xl text-center animate-slide_up delay-200 shadow-sm"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(12px)",
            maxWidth: "280px",
          }}
        >
          <p className="text-xs text-gray-500 font-bold tracking-wide">
            {state === "ready" && "Ketuk box mana aja buat reveal photocard kamu"}
            {state === "selecting" && "Lagi buka box..."}
            {state === "opening" && "Lagi reveal kartunya..."}
          </p>
        </div>

        {/* Mystery boxes grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8 lg:gap-12 mb-8 md:mb-12 w-full max-w-2xl mx-auto">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-center animate-slide_up"
              style={{
                animationDelay: `${0.1 + i * 0.08}s`,
                opacity: 0,
              }}
            >
              <MysteryBox
                index={i}
                onSelect={handleBoxSelect}
                isSelected={selectedBox === i}
                isDisabled={state !== "ready"}
                isOpening={state === "opening" && selectedBox === i}
              />
            </div>
          ))}
        </div>

        {/* Equal probability note */}
        <div
          className="rounded-2xl p-4 text-center animate-slide_up delay-500 max-w-sm mx-auto shadow-sm flex items-start gap-3"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Info size={16} className="text-pink-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 font-semibold text-left">
            Semua box punya <strong>peluang yang sama</strong> — gak ada box yang lebih "bagus". Percayain feeling kamu dan pilih!
          </p>
        </div>

        {/* Opening overlay */}
        {(state === "selecting" || state === "opening") && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(255, 245, 228, 0.85)", backdropFilter: "blur(12px)" }}
          >
            <div className="text-center flex flex-col items-center animate-slide_up">
              <div
                className="mb-8 text-pink-500"
                style={{ animation: state === "opening" ? "open_box 0.7s ease-in-out forwards" : "animate-bounce_gentle" }}
              >
                <Gift size={96} strokeWidth={1} />
              </div>
              <p className="font-extrabold text-xl text-gray-600 tracking-wide">
                {state === "selecting" ? "Lagi buka box..." : "Lagi reveal kartu kamu..."}
              </p>
              <div className="flex gap-2 justify-center mt-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full animate-bounce"
                    style={{ background: "#FFB7C5", animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function GachaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GachaContent />
    </Suspense>
  );
}
