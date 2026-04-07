// app/api/admin/photocards/seed/route.ts
import { NextResponse } from "next/server";
import { seedPhotocards } from "@/lib/photocardStore";

export async function POST() {
  try {
    const count = await seedPhotocards(10);
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${count} photocards with default stock of 10.`,
      count,
    });
  } catch (error) {
    console.error("Error seeding photocards:", error);
    return NextResponse.json(
      { error: "Failed to seed photocards" },
      { status: 500 }
    );
  }
}
