"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminModal, { useAdminModal } from "@/components/AdminModal";
import { Transaction } from "@/lib/transactionStore";
import {
  Package,
  CreditCard,
  Box,
  AlertTriangle,
  Plus,
  Minus,
  Database,
  Search,
  Filter,
  TrendingDown,
  ShoppingBag,
  LogOut,
  CheckCircle,
  XCircle,
  Store,
  Settings,
  Image as ImageIcon,
  Loader2,
  Check,
  X,
  Trash2
} from "lucide-react";

interface Photocard {
  id: string;
  groupId: string;
  name: string;
  image: string;
  stock: number;
}

type AdminTab = "payments" | "stock";

const GROUP_LABELS: Record<string, { name: string; color: string; accent: string }> = {
  treasure: { name: "TREASURE", color: "#FFD166", accent: "#F5A623" },
  nctdream: { name: "NCT DREAM", color: "#7EC8E3", accent: "#4EADE3" },
  nct127: { name: "NCT 127", color: "#FF8FAB", accent: "#FF5C8A" },
  seventeen: { name: "SEVENTEEN", color: "#C9A8FF", accent: "#9B59FF" },
  enhypen: { name: "ENHYPEN", color: "#A8E6CF", accent: "#56C596" },
};

import StarBackground from "@/components/StarBackground";

export default function AdminDashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [photocards, setPhotocards] = useState<Photocard[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [operationalHours, setOperationalHours] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("payments");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [stockSearch, setStockSearch] = useState("");
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [deletingHistory, setDeletingHistory] = useState<string | null>(null);
  const [clearingHistory, setClearingHistory] = useState(false);

  const modal = useAdminModal();

  const handleLogout = async () => {
    const ok = await modal.confirm(
      "Logout",
      "Yakin mau keluar dari dashboard?"
    );
    if (!ok) return;
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.setting) {
        setIsActive(data.setting.isActive);
        setOperationalHours(data.setting.operationalHours);
      }
    } catch (err) {}
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      } else {
        setErrorMsg("Gagal memuat transaksi.");
      }
    } catch (err) {
      setErrorMsg("Koneksi bermasalah.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotocards = async () => {
    try {
      const res = await fetch("/api/admin/photocards");
      const data = await res.json();
      if (data.success) {
        setPhotocards(data.photocards);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchTransactions();
    fetchSettings();
    fetchPhotocards();
    const interval = setInterval(() => {
      fetchTransactions();
      fetchPhotocards();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive, operationalHours }),
      });
      const data = await res.json();
      if (data.success) {
        await modal.alert("Berhasil", "Pengaturan toko berhasil disimpan.", "success");
      } else {
        await modal.alert("Gagal", "Gagal menyimpan pengaturan. Coba lagi ya.", "error");
      }
    } catch (err) {
      await modal.alert("Error", "Koneksi bermasalah waktu nyimpen pengaturan.", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleApprove = async (id: string, phone: string | null | undefined) => {
    const ok = await modal.confirm(
      "Setujui Pembayaran?",
      "Pembayaran ini akan disetujui dan gacha token akan dibuat. Lanjutkan?",
      "Konfirmasi"
    );
    if (!ok) return;

    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        const token = data.token;
        const msg = encodeURIComponent(
          `🎉 *PEMBAYARAN DIVERIFIKASI!* 🎉\n\nHalo! Makasih udah jajan di Haneul Gacha Box. Ini Token K-Pop khusus buat kamu:\n\n✨ *${token}* ✨\n\n*(Tahan pesan ini lalu pilih Copy/Salin kalau mau input manual)*\n\n👇 *CARA CEPET: TINGGAL KLIK LINK INI!* 👇\n${window.location.origin}/redeem?token=${token}`
        );
        const cleanPhone = phone?.replace(/\D/g, '') || '';
        const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone.startsWith('8') ? '62' + cleanPhone : cleanPhone;
        window.open(`https://wa.me/${waPhone}?text=${msg}`, "_blank");
        fetchTransactions();
      } else {
        await modal.alert("Gagal", data.error ?? "Gagal menyetujui transaksi ini.", "error");
      }
    } catch (err) {
      await modal.alert("Error", "Koneksi bermasalah. Coba lagi ya.", "error");
    }
  };

  const handleReject = async (id: string, phone: string | null | undefined) => {
    const reason = await modal.prompt(
      "Tolak Pembayaran",
      "Masukkan alasan penolakan:",
      "contoh: Bukti pembayaran tidak valid"
    );
    if (reason === null) return;

    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, reason }),
      });
      const data = await res.json();

      if (data.success) {
        const msg = encodeURIComponent(
          `Halo! Maaf ya, pembayaran Gacha K-Pop kamu ditolak.\nAlasan: ${reason || 'Bukti pembayaran tidak valid'}.\n\nSilakan coba lagi.`
        );
        const cleanPhone = phone?.replace(/\D/g, '') || '';
        const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone.startsWith('8') ? '62' + cleanPhone : cleanPhone;
        window.open(`https://wa.me/${waPhone}?text=${msg}`, "_blank");
        fetchTransactions();
      } else {
        await modal.alert("Gagal", data.error ?? "Gagal menolak transaksi ini.", "error");
      }
    } catch (err) {
      await modal.alert("Error", "Koneksi bermasalah. Coba lagi ya.", "error");
    }
  };

  const handleStockUpdate = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    setUpdatingStock(id);
    try {
      const res = await fetch("/api/admin/photocards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        setPhotocards((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
        );
      }
    } catch (err) {}
    setUpdatingStock(null);
  };

  const handleSeedPhotocards = async () => {
    const ok = await modal.confirm(
      "Inisialisasi Database",
      "Ini akan mengisi database dari gachaPool.json. Stok yang ada gak akan direset. Lanjutkan?",
      "Init Data"
    );
    if (!ok) return;

    setSeeding(true);
    try {
      const res = await fetch("/api/admin/photocards/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await modal.alert("Berhasil", data.message, "success");
        fetchPhotocards();
      } else {
        await modal.alert("Gagal", data.error ?? "Gagal mengisi data.", "error");
      }
    } catch (err) {
      await modal.alert("Error", "Koneksi bermasalah.", "error");
    }
    setSeeding(false);
  };

  const handleDeleteHistory = async (id: string) => {
    const ok = await modal.confirm(
      "Hapus Riwayat",
      "Yakin mau hapus transaksi ini dari riwayat? Aksi ini tidak bisa dibatalkan.",
      "Hapus"
    );
    if (!ok) return;

    setDeletingHistory(id);
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } else {
        await modal.alert("Gagal", data.error ?? "Gagal menghapus riwayat ini.", "error");
      }
    } catch {
      await modal.alert("Error", "Koneksi bermasalah. Coba lagi ya.", "error");
    }
    setDeletingHistory(null);
  };

  const handleClearHistory = async () => {
    const ok = await modal.confirm(
      "Hapus Semua Riwayat",
      "Ini akan menghapus SEMUA riwayat transaksi (paid, used, rejected). Transaksi pending tidak akan terhapus. Lanjutkan?",
      "Hapus Semua"
    );
    if (!ok) return;

    setClearingHistory(true);
    try {
      const res = await fetch("/api/admin/transactions/clear-history", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await modal.alert("Berhasil", `${data.count} riwayat berhasil dihapus.`, "success");
        fetchTransactions();
      } else {
        await modal.alert("Gagal", data.error ?? "Gagal menghapus riwayat.", "error");
      }
    } catch {
      await modal.alert("Error", "Koneksi bermasalah. Coba lagi ya.", "error");
    }
    setClearingHistory(false);
  };

  const handleSetAllStock = async (groupId: string) => {
    const value = await modal.prompt(
      "Update Stok Massal",
      `Masukkan nilai stok baru buat SEMUA member dari ${GROUP_LABELS[groupId]?.name || groupId}:`,
      "contoh: 10"
    );
    if (value === null) return;
    const stock = parseInt(value as string, 10);
    if (isNaN(stock) || stock < 0) {
      await modal.alert("Error", "Masukkan angka yang valid (≥ 0) ya.", "error");
      return;
    }

    const groupCards = photocards.filter((p) => p.groupId === groupId);
    for (const card of groupCards) {
      await handleStockUpdate(card.id, stock);
    }
    await modal.alert("Berhasil", `Stok semua member ${GROUP_LABELS[groupId]?.name} sudah diset ke ${stock}.`, "success");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-pink-500" size={32} />
          <span className="text-gray-500 font-medium text-sm">Lagi ngeload Dashboard...</span>
        </div>
      </main>
    );
  }

  const pendingTxs = transactions
    .filter((t) => t.status === "pending")
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const historyTxs = transactions
    .filter((t) => t.status !== "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Stock stats
  const totalCards = photocards.length;
  const totalStock = photocards.reduce((sum, p) => sum + p.stock, 0);
  const outOfStock = photocards.filter((p) => p.stock === 0).length;
  const lowStock = photocards.filter((p) => p.stock > 0 && p.stock <= 3).length;

  // Filter/search photocards
  const filteredPhotocards = photocards.filter((p) => {
    if (stockFilter !== "all" && p.groupId !== stockFilter) return false;
    if (stockSearch && !p.name.toLowerCase().includes(stockSearch.toLowerCase())) return false;
    return true;
  });

  // Group photocards by groupId
  const groupedPhotocards: Record<string, Photocard[]> = {};
  for (const p of filteredPhotocards) {
    if (!groupedPhotocards[p.groupId]) groupedPhotocards[p.groupId] = [];
    groupedPhotocards[p.groupId].push(p);
  }

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 pb-20 font-sans text-gray-900 overflow-hidden selection:bg-pink-100 selection:text-pink-900">
      <StarBackground />
      <AdminModal
        config={modal.modalConfig}
        onConfirm={modal.handleConfirm}
        onCancel={modal.handleCancel}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 tracking-tight text-gray-800 font-display">Admin Dashboard</h1>
            <p className="text-gray-600 font-medium text-sm">
              Kelola transaksi dan inventaris photocard.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 glass-card hover:bg-white text-gray-700 font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>

        {/* Store Status */}
        <div className="glass-panel border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-3xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isActive ? 'bg-pink-50 text-pink-600' : 'bg-gray-100 text-gray-500'}`}>
              <Store size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Status Toko</h3>
              <p className="text-sm text-gray-500">Kelola ketersediaan dan operasional toko.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 border-r border-transparent sm:border-gray-200 pr-0 sm:pr-4">
              <span className="font-bold text-sm min-w-[65px]">{isActive ? "ONLINE" : "OFFLINE"}</span>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${isActive ? "bg-pink-600" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={operationalHours}
                onChange={(e) => setOperationalHours(e.target.value)}
                placeholder="contoh: 08:00 - 22:00"
                className="px-4 py-2.5 rounded-xl border border-white/40 w-full sm:w-40 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium glass-input text-gray-800"
              />
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="bg-gray-800 hover:bg-gray-900 border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                {savingSettings ? <Loader2 size={16} className="animate-spin" /> : <Settings size={16} />}
                Simpan
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 border-b border-white/50">
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
              activeTab === "payments"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-white/60"
            }`}
          >
            <CreditCard size={18} />
            Transaksi
            {pendingTxs.length > 0 && (
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
                activeTab === "payments" ? "bg-pink-100 text-pink-700" : "bg-gray-100 text-gray-600"
              }`}>
                {pendingTxs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
              activeTab === "stock"
                ? "border-pink-600 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <Package size={18} />
            Inventaris
            {outOfStock > 0 && (
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
                activeTab === "stock" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
              }`}>
                {outOfStock} habis
              </span>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3 font-medium border border-red-200">
            <AlertTriangle size={18} /> {errorMsg}
          </div>
        )}

        {/* =================== PAYMENTS TAB =================== */}
        {activeTab === "payments" && (
          <>
            <section className="mb-10">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                Menunggu Verifikasi ({pendingTxs.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pendingTxs.length === 0 ? (
                  <div className="col-span-full glass-panel border-white/40 shadow-sm rounded-3xl p-10 text-center flex flex-col items-center justify-center">
                    <CheckCircle className="text-gray-400 mb-3" size={32} />
                    <p className="text-gray-600 font-bold">Semua beres! Gak ada transaksi yang nunggu.</p>
                  </div>
                ) : (
                  pendingTxs.map((tx) => (
                    <div key={tx.id} className="glass-panel border-white/40 rounded-3xl p-6 shadow-sm flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-black text-pink-700 bg-pink-100/80 px-2.5 py-1 rounded-full mb-2 block w-max uppercase tracking-widest backdrop-blur-sm border border-pink-200/50">
                            {tx.group}
                          </span>
                          <p className="text-xs text-gray-500 font-semibold">{new Date(tx.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mb-5 flex-1">
                        <p className="text-sm font-semibold text-gray-800 mb-3">
                          WhatsApp: <span className="text-pink-600">{tx.phoneNumber}</span>
                        </p>
                        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50/50 aspect-video relative group flex items-center justify-center">
                          {tx.proofUrl ? (
                            <a href={tx.proofUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-zoom-in">
                              <img src={tx.proofUrl} alt="Bukti Pembayaran" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                                <Search size={20} />
                              </div>
                            </a>
                          ) : (
                            <div className="flex flex-col items-center text-gray-400">
                              <ImageIcon size={24} className="mb-2 opacity-50" />
                              <span className="text-xs font-medium">Gak Ada Bukti</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2.5 mt-auto">
                        <button
                          onClick={() => handleApprove(tx.id, tx.phoneNumber)}
                          className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Check size={16} /> Setujui
                        </button>
                        <button
                          onClick={() => handleReject(tx.id, tx.phoneNumber)}
                          className="flex-1 bg-white hover:bg-red-50 text-red-600 font-semibold py-2.5 rounded-lg transition-colors border border-red-200 flex items-center justify-center gap-2 text-sm"
                        >
                          <X size={16} /> Tolak
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-bold text-gray-800">Riwayat Terbaru ({historyTxs.length})</h2>
                {historyTxs.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    disabled={clearingHistory}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold text-sm transition-colors disabled:opacity-50 w-full sm:w-auto"
                  >
                    {clearingHistory ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Hapus Semua Riwayat
                  </button>
                )}
              </div>
              <div className="glass-panel border-white/40 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white/40 backdrop-blur-md text-gray-800 border-b border-white/50">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Tanggal</th>
                        <th className="px-5 py-4 font-semibold">Grup</th>
                        <th className="px-5 py-4 font-semibold">WhatsApp</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                        <th className="px-5 py-4 font-semibold">Token</th>
                        <th className="px-5 py-4 font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {historyTxs.slice(0, 20).map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4 text-gray-500">{new Date(tx.createdAt).toLocaleString()}</td>
                          <td className="px-5 py-4 font-semibold text-gray-900 uppercase">{tx.group}</td>
                          <td className="px-5 py-4 text-gray-600">{tx.phoneNumber}</td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                                tx.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : tx.status === "used"
                                    ? "bg-pink-100 text-pink-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-xs text-gray-500">{tx.token || "-"}</td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => handleDeleteHistory(tx.id)}
                              disabled={deletingHistory === tx.id}
                              title="Hapus dari riwayat"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all disabled:opacity-40"
                            >
                              {deletingHistory === tx.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {historyTxs.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-gray-400 font-medium">
                            Gak ada riwayat yang ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}

        {/* =================== STOCK MANAGEMENT TAB =================== */}
        {activeTab === "stock" && (
          <>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="glass-panel border-white/40 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Box size={16} className="text-pink-500" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Kartu</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalCards}</p>
              </div>
              <div className="glass-panel border-white/40 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag size={16} className="text-emerald-500" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Stok</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalStock}</p>
              </div>
              <div className="glass-panel border-white/40 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-amber-500" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stok Sedikit</span>
                </div>
                <p className="text-3xl font-bold text-amber-600">{lowStock}</p>
              </div>
              <div className="glass-panel border-white/40 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={16} className="text-red-500" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Habis</span>
                </div>
                <p className="text-3xl font-bold text-red-600">{outOfStock}</p>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 glass-panel p-3 rounded-2xl border border-white/40 shadow-sm">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari member..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/40 bg-white/20 backdrop-blur-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder:text-gray-500 text-gray-800"
                />
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-48">
                <Filter size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none cursor-pointer"
                >
                  <option value="all">Semua Grup</option>
                  {Object.entries(GROUP_LABELS).map(([id, g]) => (
                    <option key={id} value={id}>{g.name}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex shrink-0">
                <button
                  onClick={handleSeedPhotocards}
                  disabled={seeding}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                  <Database size={16} />
                  {seeding ? "Inisialisasi..." : "Init Data"}
                </button>
              </div>
            </div>

            {/* Photocard Groups */}
            {photocards.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
                <Database size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1} />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Belum Ada Data Photocard</h3>
                <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">
                  Klik tombol "Init Data" di atas untuk ngisi database dari gachaPool.json.
                </p>
              </div>
            ) : (
              Object.entries(groupedPhotocards).map(([groupId, cards]) => {
                const groupInfo = GROUP_LABELS[groupId] || { name: groupId.toUpperCase(), color: "#999", accent: "#666" };
                const groupAvailable = cards.filter((c) => c.stock > 0).length;
                const groupTotal = cards.length;

                return (
                  <div
                    key={groupId}
                    className="mb-8 glass-panel rounded-3xl border border-white/40 overflow-hidden shadow-sm"
                  >
                    {/* Group Header */}
                    <div className="px-5 py-4 border-b border-white/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/20 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: groupInfo.accent }}
                        />
                        <h3 className="font-bold text-gray-900 text-base">{groupInfo.name}</h3>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-600">
                          {groupAvailable} / {groupTotal} tersedia
                        </span>
                      </div>
                      <button
                        onClick={() => handleSetAllStock(groupId)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-auto"
                      >
                        Set Semua Stok
                      </button>
                    </div>

                    {/* Members Grid */}
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cards.map((card) => (
                        <div
                          key={card.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border ${
                            card.stock === 0
                              ? "bg-red-50/30 border-red-100"
                              : card.stock <= 3
                                ? "bg-amber-50/30 border-amber-100"
                                : "bg-white border-gray-200"
                          }`}
                        >
                          {/* Member avatar */}
                          <div
                            className="relative w-12 h-12 rounded-lg flex-shrink-0 bg-white/50 overflow-hidden flex items-center justify-center"
                            style={{
                              borderBottom: `3px solid ${card.stock === 0 ? "#FCA5A5" : groupInfo.color}`,
                            }}
                          >
                            <span className="text-lg font-black text-gray-400 font-display uppercase tracking-widest">{card.name.charAt(0)}</span>
                            <img
                              src={card.image}
                              alt={card.name}
                              className="absolute inset-0 w-full h-full object-cover z-10"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>

                          {/* Name + Status */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-900 truncate mb-0.5">{card.name}</p>
                            {card.stock === 0 ? (
                              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-100 px-1.5 py-0.5 rounded">Habis</span>
                            ) : card.stock <= 3 ? (
                              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-100 px-1.5 py-0.5 rounded">Stok Sedikit</span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-1.5 py-0.5 rounded">Ada Stok</span>
                            )}
                          </div>

                          {/* Stock controls */}
                          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1">
                            <button
                              onClick={() => handleStockUpdate(card.id, card.stock - 1)}
                              disabled={card.stock === 0 || updatingStock === card.id}
                              className="w-7 h-7 rounded-md bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
                            >
                              <Minus size={14} />
                            </button>
                            <span
                              className={`w-8 text-center font-bold text-sm ${
                                card.stock === 0
                                  ? "text-red-500"
                                  : card.stock <= 3
                                    ? "text-amber-600"
                                    : "text-gray-900"
                              }`}
                            >
                              {updatingStock === card.id ? "..." : card.stock}
                            </span>
                            <button
                              onClick={() => handleStockUpdate(card.id, card.stock + 1)}
                              disabled={updatingStock === card.id}
                              className="w-7 h-7 rounded-md bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center transition-colors disabled:opacity-40 text-gray-600"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </main>
  );
}
