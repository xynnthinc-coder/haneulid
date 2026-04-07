// app/api/photocards/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPhotocardsByGroup, getStockSummaryByGroup, getAllPhotocards } from "@/lib/photocardStore";

// GET: Public API to get photocards for user display
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("group");

    // If group specified, return that group's photocards
    if (groupId) {
      const photocards = await getPhotocardsByGroup(groupId);
      return NextResponse.json({ success: true, photocards });
    }

    // Otherwise return all photocards + summary
    const photocards = await getAllPhotocards();
    const summary = await getStockSummaryByGroup();

    return NextResponse.json({ success: true, photocards, summary });
  } catch (error) {
    console.error("Error fetching photocards:", error);
    return NextResponse.json(
      { error: "Failed to fetch photocards" },
      { status: 500 }
    );
  }
}
