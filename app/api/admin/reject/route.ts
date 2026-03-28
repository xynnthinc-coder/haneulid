import { NextRequest, NextResponse } from "next/server";
import { updateTransaction, getTransactionById } from "@/lib/transactionStore";

export async function POST(req: NextRequest) {
  try {
    const { id, reason } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const tx = getTransactionById(id);
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (tx.status !== "pending") {
      return NextResponse.json({ error: "Transaction is not pending" }, { status: 400 });
    }
    
    // Status can be set to a new "rejected" state or just stay pending with a note, 
    // for now we'll just set it to "used" to invalidate it, or we could add "rejected" to the status type.
    // Let's just remove it or mark it. We'll mark it as used = true and status = pending so it's invalid.
    updateTransaction(id, {
      used: true // Invalidate it
    });

    return NextResponse.json({ success: true, reason });
  } catch (error) {
    console.error("Reject error:", error);
    return NextResponse.json(
      { error: "Failed to reject transaction" },
      { status: 500 }
    );
  }
}
