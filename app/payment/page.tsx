"use client";
// app/payment/page.tsx
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getGroupById } from "@/lib/groups";
import TokenDisplay from "@/components/TokenDisplay";
import StarBackground from "@/components/StarBackground";
import ProgressSteps from "@/components/ProgressSteps";

type PaymentStep = "info" | "upload" | "submitting" | "success" | "error";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const groupId = searchParams.get("group") ?? "";
  const group = getGroupById(groupId);

  const [step, setStep] = useState<PaymentStep>("info");
  const [token, setToken] = useState<string>("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Transaction is created upon submitting proof

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size must be less than 5MB.");
      return;
    }

    setErrorMsg("");
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setProofPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitPayment = async () => {
    if (!phoneNumber) {
      setErrorMsg("Please enter your WhatsApp number.");
      return;
    }
    if (!proofFile) {
      setErrorMsg("Please upload your payment proof first.");
      return;
    }

    setStep("submitting");

    try {
      const formData = new FormData();
      formData.append("group", groupId);
      formData.append("phoneNumber", phoneNumber);
      formData.append("proof", proofFile);

      const res = await fetch("/api/submit-payment", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setStep("success");
      } else {
        setErrorMsg(data.error ?? "Failed to submit payment. Please try again.");
        setStep("error");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
      setStep("error");
    }
  };

  const navigateToHome = () => {
    router.push("/");
  };

  if (!group) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-6xl mb-4">😢</p>
          <h2 className="text-xl font-bold text-gray-600 mb-4">Group not found!</h2>
          <Link href="/group">
            <button className="btn-primary">Choose a Group</button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      <StarBackground />

      <div className="relative z-10 max-w-md mx-auto w-full">
        {/* Back button */}
        <Link
          href="/group"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-400 transition-colors mb-6"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Change Group
        </Link>

        {/* Progress steps */}
        <ProgressSteps currentStep={2} />

        {/* ===== STEP: INFO ===== */}
        {(step === "info" || step === "upload") && (
          <>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black mb-1" style={{ color: "#2D2D2D" }}>
                Complete Payment
              </h1>
              <p className="text-sm text-gray-400 font-semibold">
                Almost there! Pay to open your mystery box~
              </p>
            </div>

            {/* Order summary card */}
            <div
              className="rounded-3xl p-5 mb-5"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                border: "2px solid rgba(255, 183, 197, 0.4)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{group.emoji}</span>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                    Selected Group
                  </p>
                  <p className="font-black text-xl" style={{ color: "#2D2D2D" }}>
                    {group.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-dashed border-pink-200">
                <span className="text-sm font-semibold text-gray-500">Blind Box × 1</span>
                <span className="font-black text-lg" style={{ color: "#FF5C8A" }}>
                  Rp10.000
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold text-gray-600">Total</span>
                <span className="font-black text-xl" style={{ color: "#FF5C8A" }}>
                  Rp10.000
                </span>
              </div>
            </div>


            {/* QRIS Payment section */}
            <div
              className="rounded-3xl p-5 mb-5"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                border: "2px solid rgba(184, 224, 255, 0.4)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h3 className="font-bold text-gray-600 mb-3 flex items-center gap-2">
                <span>📱</span> Payment via QRIS
              </h3>

              {/* QRIS placeholder */}
              <div
                className="rounded-2xl overflow-hidden mb-4 mx-auto"
                style={{ maxWidth: "200px" }}
              >
                <img
                  src="/qris.jpg"
                  alt="QRIS Payment Code"
                  className="w-full"
                  onError={(e) => {
                    // Show placeholder if QRIS image not found
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Fallback QRIS placeholder */}
                <div
                  className="flex items-center justify-center rounded-2xl"
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    background: "linear-gradient(135deg, #f0f0f0, #e0e0e0)",
                    border: "3px solid #FFB7C5",
                  }}
                >
                  <div className="text-center p-4">
                    <p className="text-4xl mb-2">📲</p>
                    <p className="text-xs text-gray-400 font-semibold leading-snug">
                      QRIS Payment
                      <br />
                      Code Here
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl p-3 text-xs text-gray-500 font-semibold leading-relaxed"
                style={{ background: "rgba(255, 245, 228, 0.8)" }}
              >
                <p className="mb-1">📌 Payment Instructions:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open your mobile banking / e-wallet app</li>
                  <li>Scan the QRIS code above</li>
                  <li>Enter the amount: <strong>Rp10.000</strong></li>
                  <li>Complete the payment</li>
                  <li>Take a screenshot of the receipt</li>
                  <li>Upload the screenshot below</li>
                </ol>
              </div>
            </div>

            {/* User Input Section (WhatsApp Number) */}
            <div
              className="rounded-3xl p-5 mb-5"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                border: "2px solid rgba(255, 183, 197, 0.4)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h3 className="font-bold text-gray-600 mb-3 flex items-center gap-2">
                <span>💬</span> WhatsApp Number
              </h3>
              <p className="text-xs text-gray-500 font-semibold mb-3">
                Your token will be sent instantly to this number once payment is verified!
              </p>
              <input
                type="tel"
                placeholder="e.g. 081234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl text-sm font-semibold outline-none"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "2px solid rgba(255,183,197,0.5)",
                  color: "#2D2D2D",
                }}
              />
            </div>

            {/* Upload section */}
            <div
              className="rounded-3xl p-5 mb-6"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                border: "2px solid rgba(229, 196, 255, 0.4)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h3 className="font-bold text-gray-600 mb-3 flex items-center gap-2">
                <span>📸</span> Upload Payment Proof
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {proofPreview ? (
                <div className="mb-3">
                  <div className="relative rounded-2xl overflow-hidden" style={{ maxHeight: "180px" }}>
                    <img src={proofPreview} alt="Payment proof" className="w-full object-cover" />
                    <button
                      onClick={() => { setProofFile(null); setProofPreview(null); }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: "rgba(255, 92, 138, 0.9)" }}
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-green-500 font-semibold mt-2 text-center">
                    ✓ {proofFile?.name}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-2xl py-8 text-center transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    border: "2px dashed #E5C4FF",
                    background: "rgba(229, 196, 255, 0.1)",
                  }}
                >
                  <span className="text-3xl block mb-2">📁</span>
                  <span className="text-sm font-bold text-gray-400">
                    Tap to upload proof of payment
                  </span>
                  <br />
                  <span className="text-xs text-gray-300">JPG, PNG, WebP (max 5MB)</span>
                </button>
              )}

              {errorMsg && (
                <p className="text-xs text-red-400 font-semibold mt-2 text-center">{errorMsg}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmitPayment}
              disabled={!proofFile}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="flex items-center justify-center gap-2">
                <span>💳</span>
                <span>Submit Payment Proof</span>
              </span>
            </button>
          </>
        )}

        {/* ===== STEP: SUBMITTING ===== */}
        {step === "submitting" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-6xl mb-6 animate-bounce">⏳</div>
            <h2 className="text-2xl font-black text-gray-600 mb-2">Verifying Payment...</h2>
            <p className="text-sm text-gray-400 font-semibold">
              Please wait while we confirm your payment~
            </p>
            <div className="mt-6 flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full animate-bounce"
                  style={{
                    background: "#FFB7C5",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===== STEP: SUCCESS ===== */}
        {step === "success" && (
          <div className="flex flex-col items-center text-center animate-slide_up">
            {/* Success icon */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 animate-bounce_gentle"
              style={{
                background: "linear-gradient(135deg, #C4F5E0, #7ADDB8)",
                boxShadow: "0 12px 32px rgba(122, 221, 184, 0.4)",
              }}
            >
              ⏳
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-700 mb-2">
              Payment Pending 🎉
            </h2>
            <p className="text-sm text-gray-400 font-semibold mb-6">
              Please wait while our admin verifies your payment!
            </p>

            {/* Instruction */}
            <div
              className="w-full rounded-2xl p-4 mb-6"
              style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px dashed #FFB7C5" }}
            >
              <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                We're checking your payment proof. Once approved, we will send your 
                <strong> Gacha Token </strong> directly to your WhatsApp! 💕
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={navigateToHome}
              className="w-full btn-primary text-xl py-5"
            >
              <span className="flex items-center justify-center gap-3">
                <span>🎁</span>
                <span>Back to Home</span>
              </span>
            </button>
          </div>
        )}

        {/* ===== STEP: ERROR ===== */}
        {step === "error" && (
          <div className="flex flex-col items-center text-center animate-slide_up">
            <div className="text-6xl mb-4">😭</div>
            <h2 className="text-2xl font-black text-gray-600 mb-2">Oops!</h2>
            <p className="text-sm text-red-400 font-semibold mb-6">{errorMsg}</p>
            <button
              onClick={() => { setStep("info"); setErrorMsg(""); }}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
