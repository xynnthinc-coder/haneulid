import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let setting = await prisma.setting.findUnique({
      where: { id: "default" },
    });

    if (!setting) {
      setting = await prisma.setting.create({
        data: {
          id: "default",
          isActive: true,
          operationalHours: "08:00 - 22:00",
        },
      });
    }

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
