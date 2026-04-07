import { NextRequest, NextResponse } from "next/server";
import { createTransaction } from "@/lib/transactionStore";
import { generateId } from "@/lib/tokenGenerator";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const group = formData.get("group") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const proofFile = formData.get("proof") as File | null;

    if (!group || !phoneNumber || !proofFile) {
      return NextResponse.json(
        { error: "Group, phone number, and proof are required" },
        { status: 400 }
      );
    }

    // Convert file to Base64 string since Vercel has a read-only filesystem
    const buffer = Buffer.from(await proofFile.arrayBuffer());
    const mimeType = proofFile.type || 'image/jpeg';
    const base64Data = buffer.toString('base64');
    const proofUrl = `data:${mimeType};base64,${base64Data}`;
    const id = generateId();

    const transaction = await createTransaction({
      id,
      group,
      status: "pending",
      used: false,
      phoneNumber,
      proofUrl,
    });

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      const message = `🚨 *PESANAN BARU MASUK!* 🚨\n\n👤 *WhatsApp:* ${phoneNumber}\n💳 *Grup:* ${group.toUpperCase()}\n\n[🔗 Cek Dashboard Admin](${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/admin)`;
      fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }).catch((err) => console.error("Telegram Error:", err));
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        status: transaction.status,
      },
    });
  } catch (error) {
    console.error("Error submitting payment:", error);
    return NextResponse.json(
      { error: "Failed to submit payment" },
      { status: 500 }
    );
  }
}
