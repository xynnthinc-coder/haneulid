// app/api/create-transaction/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createTransaction } from "@/lib/transactionStore";
import { generateGachaToken, generateId } from "@/lib/tokenGenerator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { group } = body;

    if (!group) {
      return NextResponse.json({ error: "Group is required" }, { status: 400 });
    }

    const validGroups = ["nct", "seventeen", "straykids", "bts"];
    if (!validGroups.includes(group)) {
      return NextResponse.json({ error: "Invalid group" }, { status: 400 });
    }

    const token = generateGachaToken();
    const id = generateId();

    const transaction = await createTransaction({
      id,
      token,
      group,
      status: "pending",
      used: false,
    });

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        token: transaction.token,
        group: transaction.group,
        status: transaction.status,
      },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
