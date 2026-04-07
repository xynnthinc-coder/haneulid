// app/api/admin/photocards/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllPhotocards, updateStock } from "@/lib/photocardStore";

export const dynamic = "force-dynamic";

// GET: List all photocards (admin)
export async function GET() {
  try {
    const photocards = await getAllPhotocards();
    return NextResponse.json({ success: true, photocards });
  } catch (error) {
    console.error("Error fetching photocards:", error);
    return NextResponse.json(
      { error: "Failed to fetch photocards" },
      { status: 500 }
    );
  }
}

// PATCH: Update stock for a single photocard
export async function PATCH(req: NextRequest) {
  try {
    const { id, stock } = await req.json();

    if (!id || stock === undefined || stock === null) {
      return NextResponse.json(
        { error: "ID and stock are required" },
        { status: 400 }
      );
    }

    if (typeof stock !== "number" || stock < 0) {
      return NextResponse.json(
        { error: "Stock must be a non-negative number" },
        { status: 400 }
      );
    }

    const updated = await updateStock(id, stock);

    if (!updated) {
      return NextResponse.json(
        { error: "Photocard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, photocard: updated });
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Failed to update stock" },
      { status: 500 }
    );
  }
}
