// app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getTransactionByToken,
  updateTransaction,
} from "@/lib/transactionStore";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get("token") as string;
    const proofFile = formData.get("proof") as File | null;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const transaction = await getTransactionByToken(token);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (transaction.status === "used") {
      return NextResponse.json(
        { error: "Token has already been used" },
        { status: 400 }
      );
    }

    // In production: validate the payment proof against a real payment gateway.
    // Here we auto-approve after receiving proof upload.
    const updatedTransaction = await updateTransaction(transaction.id, {
      status: "paid",
      proofUrl: proofFile ? `/uploads/${proofFile.name}` : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully!",
      transaction: {
        token: updatedTransaction?.token,
        status: updatedTransaction?.status,
        group: updatedTransaction?.group,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
