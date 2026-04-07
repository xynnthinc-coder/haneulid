import { prisma } from "./db";

export interface Photocard {
  id: string;
  groupId: string;
  name: string;
  image: string;
  stock: number;
}

export async function getAllPhotocards(): Promise<Photocard[]> {
  return await prisma.photocard.findMany({
    orderBy: [{ groupId: "asc" }, { name: "asc" }],
  });
}

export async function getPhotocardsByGroup(groupId: string): Promise<Photocard[]> {
  return await prisma.photocard.findMany({
    where: { groupId },
    orderBy: { name: "asc" },
  });
}

export async function getAvailableByGroup(groupId: string): Promise<Photocard[]> {
  return await prisma.photocard.findMany({
    where: { groupId, stock: { gt: 0 } },
    orderBy: { name: "asc" },
  });
}

export async function updateStock(id: string, stock: number): Promise<Photocard | null> {
  try {
    return await prisma.photocard.update({
      where: { id },
      data: { stock: Math.max(0, stock) },
    });
  } catch {
    return null;
  }
}

export async function decrementStock(id: string): Promise<Photocard | null> {
  try {
    // Use raw update to atomically decrement
    const card = await prisma.photocard.findUnique({ where: { id } });
    if (!card || card.stock <= 0) return null;

    return await prisma.photocard.update({
      where: { id },
      data: { stock: { decrement: 1 } },
    });
  } catch {
    return null;
  }
}

export async function getStockSummaryByGroup(): Promise<
  Record<string, { total: number; available: number; outOfStock: number }>
> {
  const all = await getAllPhotocards();
  const summary: Record<string, { total: number; available: number; outOfStock: number }> = {};

  for (const card of all) {
    if (!summary[card.groupId]) {
      summary[card.groupId] = { total: 0, available: 0, outOfStock: 0 };
    }
    summary[card.groupId].total++;
    if (card.stock > 0) {
      summary[card.groupId].available++;
    } else {
      summary[card.groupId].outOfStock++;
    }
  }

  return summary;
}

export async function seedPhotocards(defaultStock: number = 10): Promise<number> {
  const gachaPool = await import("@/data/gachaPool.json");
  let count = 0;

  for (const [groupId, members] of Object.entries(gachaPool)) {
    if (groupId === "default") continue; // skip default export
    for (const member of members as Array<{ name: string; image: string }>) {
      await prisma.photocard.upsert({
        where: {
          groupId_name: { groupId, name: member.name },
        },
        update: { image: member.image }, // update image if changed, keep stock
        create: {
          groupId,
          name: member.name,
          image: member.image,
          stock: defaultStock,
        },
      });
      count++;
    }
  }

  return count;
}
