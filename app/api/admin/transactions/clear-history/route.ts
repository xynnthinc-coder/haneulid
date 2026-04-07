import { NextResponse } from "next/server";
import { clearTransactionHistory } from "@/lib/transactionStore";

export async function DELETE() {
  try {
    const count = await clearTransactionHistory();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus riwayat." }, { status: 500 });
  }
}
