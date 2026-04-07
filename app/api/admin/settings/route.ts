import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { isActive, operationalHours } = await req.json();

    const setting = await prisma.setting.upsert({
      where: { id: "default" },
      update: {
        isActive,
        operationalHours,
      },
      create: {
        id: "default",
        isActive,
        operationalHours: operationalHours || "08:00 - 22:00",
      },
    });

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
