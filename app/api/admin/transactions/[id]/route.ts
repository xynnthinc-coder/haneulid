import { NextResponse } from "next/server";
import { deleteTransaction, getTransactionById } from "@/lib/transactionStore";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const tx = await getTransactionById(id);
    if (!tx) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
    }
    if (tx.status === "pending") {
      return NextResponse.json(
        { error: "Transaksi pending tidak bisa dihapus dari riwayat." },
        { status: 400 }
      );
    }

    const ok = await deleteTransaction(id);
    if (!ok) {
      return NextResponse.json({ error: "Gagal menghapus transaksi." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
