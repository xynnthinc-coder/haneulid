// app/api/gacha/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getTransactionByToken,
  updateTransaction,
} from "@/lib/transactionStore";
import gachaPool from "@/data/gachaPool.json";

type GachaPool = {
  [key: string]: Array<{ name: string; image: string }>;
};

const pool = gachaPool as GachaPool;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Validate token
    const transaction = getTransactionByToken(token);

    if (!transaction) {
      return NextResponse.json(
        { error: "Invalid token. Please complete payment first." },
        { status: 404 }
      );
    }

    if (transaction.status !== "paid") {
      return NextResponse.json(
        {
          error:
            transaction.status === "pending"
              ? "Payment not verified yet. Please upload your payment proof."
              : "This token has already been used.",
        },
        { status: 400 }
      );
    }

    if (transaction.used) {
      return NextResponse.json(
        { error: "This token has already been used. Each token is single-use." },
        { status: 400 }
      );
    }

    // Get photocard pool for this group
    const groupPool = pool[transaction.group];

    if (!groupPool || groupPool.length === 0) {
      return NextResponse.json(
        { error: "No photocards available for this group." },
        { status: 500 }
      );
    }

    // Equal probability random selection
    const randomIndex = Math.floor(Math.random() * groupPool.length);
    const selectedCard = groupPool[randomIndex];

    // Mark token as used
    updateTransaction(token, {
      status: "used",
      used: true,
    });

    return NextResponse.json({
      success: true,
      result: {
        name: selectedCard.name,
        group: transaction.group.toUpperCase(),
        groupId: transaction.group,
        image: selectedCard.image,
      },
    });
  } catch (error) {
    console.error("Error processing gacha:", error);
    return NextResponse.json(
      { error: "Failed to process gacha" },
      { status: 500 }
    );
  }
}

// Validate token without using it (for page access check)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const transaction = getTransactionByToken(token);

  if (!transaction) {
    return NextResponse.json({ valid: false, error: "Token not found" });
  }

  return NextResponse.json({
    valid: transaction.status === "paid" && !transaction.used,
    status: transaction.status,
    used: transaction.used,
    group: transaction.group,
  });
}
