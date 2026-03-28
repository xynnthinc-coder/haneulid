"use client";
// app/gacha/page.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
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

export default function GachaPage() {
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
      setErrorMsg("No token provided. Please complete payment first.");
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
          setErrorMsg("This token has already been used. Each box can only be opened once! 😢");
        } else if (data.status === "pending") {
          setErrorMsg("Payment not verified yet. Please upload your payment proof.");
        } else {
          setErrorMsg(data.error ?? "Invalid token. Please complete payment first.");
        }
        setState("invalid");
      } else {
        setGroupName(data.group?.toUpperCase() ?? "");
        setState("ready");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
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
          setErrorMsg(data.error ?? "Failed to open box.");
          setState("error");
        }
      } catch (err) {
        setErrorMsg("Network error. Please try again.");
        setState("error");
      }
    }, 400);
  };

  // ===== VALIDATING =====
  if (state === "validating") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔍</div>
          <p className="font-bold text-gray-500">Checking your token...</p>
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
          <div className="text-6xl mb-4">
            {state === "invalid" ? "🚫" : "😭"}
          </div>
          <h2 className="text-2xl font-black text-gray-600 mb-3">
            {state === "invalid" ? "Access Denied" : "Something Went Wrong"}
          </h2>
          <p className="text-sm text-gray-400 font-semibold mb-6 leading-relaxed">
            {errorMsg}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/group">
              <button className="w-full btn-primary">Start Fresh 🎁</button>
            </Link>
            {state === "error" && (
              <button
                onClick={() => { setState("validating"); validateToken(); }}
                className="w-full btn-secondary"
              >
                Try Again
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

      <div className="relative z-10 max-w-md mx-auto w-full">
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
            className="text-2xl sm:text-3xl font-black mb-1 animate-slide_up"
            style={{ color: "#2D2D2D" }}
          >
            Choose Your Box
          </h1>
          <p className="text-sm text-gray-400 font-semibold animate-slide_up delay-100">
            {groupName && `${groupName} Collection · `}Pick one mystery box! 🎁
          </p>
        </div>

        {/* Hint text */}
        <div
          className="mx-auto mb-6 px-4 py-3 rounded-2xl text-center animate-slide_up delay-200"
          style={{
            background: "rgba(255, 255, 255, 0.6)",
            border: "1px solid rgba(255, 183, 197, 0.3)",
            backdropFilter: "blur(8px)",
            maxWidth: "280px",
          }}
        >
          <p className="text-xs text-gray-400 font-bold">
            {state === "ready" && "✨ Tap any box to reveal your photocard!"}
            {state === "selecting" && "🎊 Opening your box..."}
            {state === "opening" && "✨ Revealing your card..."}
          </p>
        </div>

        {/* Mystery boxes grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
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
          className="rounded-2xl p-4 text-center animate-slide_up delay-500"
          style={{
            background: "rgba(255, 255, 255, 0.5)",
            border: "1px solid rgba(255, 183, 197, 0.25)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p className="text-xs text-gray-400 font-semibold">
            🎲 All boxes have <strong>equal probability</strong> — there's no "better" box!
            <br />
            Trust your gut and pick one~ 💕
          </p>
        </div>

        {/* Opening overlay */}
        {(state === "selecting" || state === "opening") && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(255, 245, 228, 0.85)", backdropFilter: "blur(12px)" }}
          >
            <div className="text-center animate-slide_up">
              <div
                className="text-8xl mb-4"
                style={{ animation: state === "opening" ? "open_box 0.7s ease-in-out forwards" : "animate-bounce" }}
              >
                🎁
              </div>
              <p className="font-black text-xl text-gray-600">
                {state === "selecting" ? "Opening box..." : "✨ Revealing your card!"}
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
