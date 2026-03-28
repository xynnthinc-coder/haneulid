"use client";
import React, { useState, useEffect } from "react";
import StarBackground from "@/components/StarBackground";
import { Transaction } from "@/lib/transactionStore";

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      } else {
        setErrorMsg("Failed to load transactions.");
      }
    } catch (err) {
      setErrorMsg("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string, phone: string | undefined) => {
    if (!window.confirm("Approve this payment and generate token?")) return;
    
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        // Send to WhatsApp
        const token = data.token;
        const msg = encodeURIComponent(
          `Hello! Your payment has been verified. Here is your K-Pop Gacha Token: *${token}*\n\nRedeem it here: ${window.location.origin}/redeem`
        );
        window.open(`https://wa.me/${phone?.replace(/^0/, '62')}?text=${msg}`, "_blank");
        
        fetchTransactions(); // Refresh
      } else {
        alert(data.error ?? "Failed to approve.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleReject = async (id: string, phone: string | undefined) => {
    const reason = window.prompt("Reason for rejection:");
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
          `Hello! Unfortunately, your K-Pop Gacha payment was rejected.\nReason: ${reason || 'Invalid proof of payment'}.\n\nPlease try again.`
        );
        window.open(`https://wa.me/${phone?.replace(/^0/, '62')}?text=${msg}`, "_blank");
        
        fetchTransactions(); // Refresh
      } else {
        alert(data.error ?? "Failed to reject.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <StarBackground />
        <div className="text-3xl animate-bounce z-10">⏳ Loading...</div>
      </main>
    );
  }

  const pendingTxs = transactions.filter(t => t.status === "pending").sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const historyTxs = transactions.filter(t => t.status !== "pending").sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-8 pb-20">
      <StarBackground />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2 text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 font-semibold">Verify pending payments manually.</p>
        </div>

        {errorMsg && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-6 font-bold">{errorMsg}</div>
        )}

        {/* Pending Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
            Pending Verification ({pendingTxs.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTxs.length === 0 ? (
              <p className="text-gray-400 font-semibold italic col-span-full bg-white/50 p-6 rounded-2xl border border-gray-200 text-center">No pending transactions.</p>
            ) : (
              pendingTxs.map((tx) => (
                <div key={tx.id} className="bg-white/80 backdrop-blur-md border border-pink-200 rounded-3xl p-5 shadow-lg flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-pink-500 bg-pink-100 px-2 py-1 rounded-md mb-1 block w-max uppercase">Group: {tx.group}</span>
                      <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex-1">
                    <p className="text-sm font-bold text-gray-700 mb-2">WhatsApp: <span className="text-blue-500">{tx.phoneNumber}</span></p>
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      {tx.proofUrl ? (
                         <a href={tx.proofUrl} target="_blank" rel="noopener noreferrer">
                           <img src={tx.proofUrl} alt="Payment Proof" className="w-full h-48 object-cover hover:scale-105 transition-transform" />
                         </a>
                      ) : (
                         <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No Proof Uploaded</div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(tx.id, tx.phoneNumber)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <span>✅</span> Approve
                    </button>
                    <button 
                      onClick={() => handleReject(tx.id, tx.phoneNumber)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 rounded-xl transition-colors border border-red-200 flex items-center justify-center gap-2"
                    >
                      <span>❌</span> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* History Section */}
        <section>
          <h2 className="text-xl font-bold mb-4text-gray-700">Recent History</h2>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100/80 text-gray-600">
                  <tr>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Group</th>
                    <th className="p-4 font-bold">WhatsApp</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Token</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historyTxs.slice(0, 10).map(tx => (
                    <tr key={tx.id} className="hover:bg-white/50 transition-colors">
                      <td className="p-4 text-gray-500">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="p-4 font-semibold uppercase">{tx.group}</td>
                      <td className="p-4 text-gray-600">{tx.phoneNumber}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                          tx.status === 'paid' ? 'bg-green-100 text-green-700' :
                          tx.status === 'used' ? 'bg-purple-100 text-purple-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-pink-500">{tx.token || '-'}</td>
                    </tr>
                  ))}
                  {historyTxs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-400 font-semibold italic">No history yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
