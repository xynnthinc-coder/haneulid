import { NextRequest, NextResponse } from "next/server";
import { updateTransaction, getTransactionById } from "@/lib/transactionStore";
import { generateGachaToken } from "@/lib/tokenGenerator";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const tx = await getTransactionById(id);
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (tx.status !== "pending") {
      return NextResponse.json({ error: "Transaction is not pending" }, { status: 400 });
    }

    const token = generateGachaToken();
    
    await updateTransaction(id, {
      status: "paid",
      token,
    });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json(
      { error: "Failed to approve transaction" },
      { status: 500 }
    );
  }
}
