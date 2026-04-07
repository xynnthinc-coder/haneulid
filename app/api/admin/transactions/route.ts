import { NextResponse } from "next/server";
import { getAllTransactions } from "@/lib/transactionStore";

export async function GET() {
  try {
    const transactions = await getAllTransactions();
    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
