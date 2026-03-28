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

    // Save proof file
    const buffer = Buffer.from(await proofFile.arrayBuffer());
    const fileName = `${Date.now()}-${proofFile.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    await fs.writeFile(filePath, buffer);

    const proofUrl = `/uploads/${fileName}`;
    const id = generateId();

    const transaction = createTransaction({
      id,
      group,
      status: "pending",
      used: false,
      createdAt: new Date().toISOString(),
      phoneNumber,
      proofUrl,
    });

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
