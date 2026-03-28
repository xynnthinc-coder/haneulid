import { prisma } from "./db";

export type TransactionStatus = "pending" | "paid" | "used";

export interface Transaction {
  id: string;
  token?: string | null;
  group: string;
  status: string;
  used: boolean;
  createdAt: Date;
  phoneNumber?: string | null;
  proofUrl?: string | null;
}

export async function createTransaction(data: Omit<Transaction, "id" | "createdAt" | "token"> & { id?: string }): Promise<Transaction> {
  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      id: data.id,
    },
  });
  return transaction;
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  return await prisma.transaction.findUnique({
    where: { id },
  });
}

export async function getTransactionByToken(token: string): Promise<Transaction | null> {
  return await prisma.transaction.findUnique({
    where: { token },
  });
}

export async function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Promise<Transaction | null> {
  try {
    return await prisma.transaction.update({
      where: { id },
      data: updates,
    });
  } catch (error) {
    return null;
  }
}

export async function getAllTransactions(): Promise<Transaction[]> {
  return await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
  });
}

