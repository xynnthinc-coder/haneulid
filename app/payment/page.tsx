"use client";
import React, { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Smartphone, CheckCircle2, UploadCloud, CreditCard, Loader2, Home, X, CheckCircle, XCircle, MessageCircle, ImageIcon, Info, Package, Banknote, Download } from "lucide-react";
import { getGroupById } from "@/lib/groups";
import ProgressSteps from "@/components/ProgressSteps";
import StarBackground from "@/components/StarBackground";

type PaymentStep = "info" | "upload" | "submitting" | "success" | "error";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const groupId = searchParams.get("group") ?? "";
  const group = getGroupById(groupId);

  const [step, setStep] = useState<PaymentStep>("info");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qrisError, setQrisError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Harap unggah gambar dengan format JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran file maksimal adalah 5MB.");
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
      setErrorMsg("Nomor WhatsApp wajib diisi.");
      return;
    }
    if (!proofFile) {
      setErrorMsg("Bukti pembayaran wajib diunggah.");
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
        setErrorMsg(data.error ?? "Gagal memproses pembayaran. Silakan coba lagi.");
        setStep("error");
      }
    } catch (err) {
      setErrorMsg("Koneksi bermasalah. Silakan coba lagi.");
      setStep("error");
    }
  };

  if (!group) {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <StarBackground />
        <div className="relative z-10 text-center max-w-sm w-full p-8 glass-panel rounded-3xl">
          <XCircle size={48} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Grup Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6 text-sm">Grup yang Anda cari mungkin tidak tersedia atau tautan tidak valid.</p>
          <Link href="/group">
            <button className="w-full btn-primary py-3">
              Pilih Grup
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-6 sm:py-10 selection:bg-pink-100 selection:text-pink-900 overflow-hidden">
      <StarBackground />
      <div className="relative z-10 max-w-4xl lg:max-w-5xl mx-auto w-full">
        {/* Back navigation */}
        <Link
          href="/group"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-500 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Kembali ke Pilihan Grup
        </Link>
        <div className="mb-8">
            <ProgressSteps currentStep={2} />
        </div>

        {/* ===== STEP: INFO & UPLOAD ===== */}
        {(step === "info" || step === "upload") && (
          <div className="animate-slide_up">
            <div className="mb-8 pl-1">
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2" style={{ color: "#2D2D2D" }}>
                Pembayaran
              </h1>
              <p className="text-gray-500 font-semibold text-sm lg:text-base">
                Selesaikan pembayaran untuk mengklaim Gacha Token kamu.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
              {/* Left Column - Order Summary & QRIS */}
              <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
                {/* Order Summary Form */}
                <div className="glass-panel border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-3xl p-5 sm:p-6 h-auto">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-1.5">
                    <Package size={14} className="text-gray-400" />
                    Ringkasan Pesanan
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner flex-shrink-0" style={{ border: `2px solid ${group.color}40` }}>
                      <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                        {group.name}
                      </p>
                      <p className="text-sm font-semibold text-gray-500 mt-0.5">Mystery Box</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-5 border-t border-dashed border-pink-200">
                    <div className="flex items-center justify-between text-gray-600 text-sm font-semibold">
                      <span>1x Token Gacha</span>
                      <span className="font-bold text-gray-800">Rp 10.000</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-dashed border-pink-200">
                    <span className="font-extrabold text-gray-800 flex items-center gap-1.5">
                      <Banknote size={16} className="text-pink-500" />
                      Total Tagihan
                    </span>
                    <span className="font-extrabold text-xl text-pink-500">
                      Rp 10.000
                    </span>
                  </div>
                </div>

                {/* QRIS Card */}
                <div className="glass-panel border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-3xl p-5 sm:p-6 relative overflow-hidden">
                  <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-pink-100 rounded-full blur-3xl z-0 opacity-40"></div>
                  
                  <h3 className="text-[15px] font-extrabold text-gray-800 flex items-center gap-2 mb-5 relative z-10">
                    <Smartphone size={20} className="text-blue-400" /> 
                    Pembayaran via QRIS
                  </h3>

                  <div className="flex justify-center mb-6 relative z-10">
                    {!qrisError ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-white/30 p-3 rounded-2xl shadow-[inset_0_2px_10px_rgba(255,255,255,0.4)] border border-white/30 backdrop-blur-md">
                           <img
                            src="/qris.jpg"
                            alt="Kode QRIS"
                            className="w-40 h-40 object-contain rounded-xl mix-blend-multiply"
                            onError={() => setQrisError(true)}
                          />
                        </div>
                        <a
                          href="/qris.jpg"
                          download="QRIS_GachaBox.jpg"
                          className="flex items-center gap-1.5 text-xs font-bold text-pink-500 hover:text-pink-600 bg-white/50 hover:bg-white/80 px-4 py-2 rounded-full border border-pink-200 transition-all shadow-sm cursor-pointer"
                        >
                          <Download size={14} />
                          Simpan QRIS
                        </a>
                      </div>
                    ) : (
                      <div className="w-40 h-40 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex flex-col items-center justify-center text-center p-4">
                        <Smartphone size={32} className="text-gray-400 mb-2" strokeWidth={1.5} />
                        <p className="text-xs text-gray-500 font-semibold">QRIS <br/> Tidak Tersedia</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 relative z-10 bg-white/20 shadow-[inset_0_2px_5px_rgba(255,255,255,0.3)] backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/30">
                     <p className="mb-2 text-xs font-bold text-gray-600 flex items-center gap-1.5">
                       <Info size={14} className="text-blue-400" />
                       Cara Bayar:
                     </p>
                     <div className="flex gap-3 text-xs sm:text-sm text-gray-700 font-semibold">
                       <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/40 shadow-sm text-gray-700 text-[10px] font-bold shrink-0 border border-white/50">1</span>
                       <span>Scan QRIS pakai e-wallet atau m-banking.</span>
                     </div>
                     <div className="flex gap-3 text-xs sm:text-sm text-gray-700 font-semibold">
                       <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/40 shadow-sm text-gray-700 text-[10px] font-bold shrink-0 border border-white/50">2</span>
                       <span>Lakukan pembayaran Rp 10.000.</span>
                     </div>
                     <div className="flex gap-3 text-xs sm:text-sm text-gray-700 font-semibold">
                       <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/40 shadow-sm text-gray-700 text-[10px] font-bold shrink-0 border border-white/50">3</span>
                       <span>Simpan & upload bukti pembayarannya.</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Upload & Confirm */}
              <div className="lg:col-span-7 flex flex-col h-full">
                <div className="glass-panel border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-3xl p-5 sm:p-6 lg:p-8 h-full flex flex-col">
                  <h2 className="text-lg font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-green-500" />
                    Konfirmasi Pembayaran
                  </h2>
                  
                  <div className="space-y-6 flex-grow">
                    {/* Phone Number Field */}
                    <div>
                      <label htmlFor="phone" className="text-sm font-extrabold text-gray-700 mb-2 flex items-center gap-1.5">
                        <MessageCircle size={16} className="text-indigo-400" />
                        Nomor WhatsApp
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Contoh: 081234567890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl text-sm font-bold transition-all placeholder-gray-500/60 text-gray-800 glass-input focus:ring-2 focus:ring-pink-300"
                      />
                      <p className="mt-2.5 text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-green-400" />
                        Gacha Token akan dikirim ke nomor ini lewat WhatsApp.
                      </p>
                    </div>

                    {/* Upload Field */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-extrabold text-gray-700 flex items-center gap-1.5">
                          <ImageIcon size={16} className="text-purple-400" />
                          Bukti Transfer
                        </label>
                        {proofFile && (
                           <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="text-xs font-bold text-pink-500 hover:text-pink-600 transition-colors"
                           >
                             Ganti File
                           </button>
                        )}
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {proofPreview ? (
                        <div className="relative rounded-2xl overflow-hidden shadow-sm group border border-white/50">
                          <img 
                            src={proofPreview} 
                            alt="Bukti pembayaran" 
                            className="w-full h-48 lg:h-64 object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"></div>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full rounded-2xl p-10 transition-all flex flex-col items-center justify-center hover:scale-[1.02] backdrop-blur-sm shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)] bg-white/10 hover:bg-white/20 border border-white/30"
                        >
                          <div className="w-14 h-14 bg-white/40 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-white/40">
                            <UploadCloud size={28} className="text-purple-500" strokeWidth={1.5} />
                          </div>
                          <p className="text-sm font-extrabold text-gray-700 mb-1">Ketuk untuk upload bukti pembayaran</p>
                          <p className="text-xs text-gray-500 font-semibold">Format: JPG, PNG, WebP (Maks 5MB)</p>
                        </button>
                      )}
                      
                      {errorMsg && (
                        <div className="mt-3 bg-red-400/10 border border-red-400/20 text-red-500 text-xs font-bold p-3 rounded-xl flex items-start gap-2 backdrop-blur-md">
                          <XCircle size={14} className="shrink-0 mt-0.5" />
                          <p>{errorMsg}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-dashed border-pink-200">
                    <button
                      onClick={handleSubmitPayment}
                      disabled={!proofFile || !phoneNumber}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-pink-200"
                    >
                      <CreditCard size={18} />
                      <span className="font-extrabold tracking-wide">Konfirmasi & Kirim</span>
                    </button>
                    {!proofFile && (
                      <p className="text-center text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">
                        Upload Bukti Pembayaran Untuk Melanjutkan
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP: SUBMITTING ===== */}
        {step === "submitting" && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] glass-panel rounded-3xl p-8 sm:p-12 animate-slide_up">
            <Loader2 className="w-12 h-12 text-pink-400 animate-spin mb-6" />
            <h2 className="text-2xl font-extrabold text-gray-800 mb-3 text-center">Memverifikasi Pembayaran</h2>
            <p className="text-gray-500 text-center max-w-sm font-semibold">
              Bentar ya, sistem lagi ngecek detail pembayaran kamu.
            </p>
          </div>
        )}

        {/* ===== STEP: SUCCESS ===== */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] glass-panel rounded-3xl p-8 sm:p-16 animate-slide_up">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-bounce_gentle"
              style={{
                background: "linear-gradient(135deg, #C4F5E0, #7ADDB8)",
                boxShadow: "0 12px 32px rgba(122, 221, 184, 0.4)",
              }}
            >
              <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={2} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800 mb-3 text-center" style={{ color: "#2D2D2D" }}>
              Pembayaran Terkirim
            </h2>
            <div className="w-full max-w-sm rounded-2xl p-4 mb-8" style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px dashed #FFB7C5" }}>
              <p className="text-sm text-gray-600 text-center font-semibold leading-relaxed">
                Tim admin akan segera memverifikasi transaksi kamu. <strong>Gacha Token</strong> lho akan otomatis dikirim ke <strong>WhatsApp</strong> kamu jika pembayaran valid.
              </p>
            </div>

            <button
              onClick={() => router.push("/")}
              className="btn-primary py-4 px-8 flex items-center justify-center gap-2 text-lg"
            >
              <Home size={18} />
              Kembali ke Beranda
            </button>
          </div>
        )}

        {/* ===== STEP: ERROR ===== */}
        {step === "error" && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] glass-panel rounded-3xl p-8 sm:p-16 animate-slide_up">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-red-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800 mb-3 text-center">
              Duh, Ada Masalah!
            </h2>
            <p className="text-gray-500 text-center font-semibold max-w-md mb-8 leading-relaxed text-sm">
              {errorMsg || "Sistem tidak dapat memproses permintaan ini. Pastikan koneksi stabil dan coba kembali."}
            </p>

            <button
              onClick={() => { setStep("info"); setErrorMsg(""); }}
              className="btn-primary py-4 px-8"
            >
              Ulangi Proses
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-pink-500 w-8 h-8" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
