// lib/tokenGenerator.ts

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateGachaToken(): string {
  let result = "GACHA-";
  for (let i = 0; i < 6; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
