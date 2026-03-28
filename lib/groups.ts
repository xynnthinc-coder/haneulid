// lib/groups.ts

export interface Group {
  id: string;
  name: string;
  color: string;
  bgGradient: string;
  accent: string;
  emoji: string;
  members: number;
  tagline: string;
}

export const GROUPS: Group[] = [
  {
    id: "nct",
    name: "NCT",
    color: "#FF8FAB",
    bgGradient: "from-pastel-pink to-pastel-pink-light",
    accent: "#FF5C8A",
    emoji: "🌙",
    members: 23,
    tagline: "Neo Culture Technology",
  },
  {
    id: "seventeen",
    name: "SEVENTEEN",
    color: "#7EC8E3",
    bgGradient: "from-pastel-blue to-pastel-blue-light",
    accent: "#4EADE3",
    emoji: "💎",
    members: 13,
    tagline: "13 Members, 3 Units, 1 Team",
  },
  {
    id: "straykids",
    name: "STRAY KIDS",
    color: "#C9A8FF",
    bgGradient: "from-pastel-purple to-pastel-blue-light",
    accent: "#9B59FF",
    emoji: "🔥",
    members: 8,
    tagline: "District 9: Unlock",
  },
  {
    id: "bts",
    name: "BTS",
    color: "#FFD166",
    bgGradient: "from-pastel-yellow to-pastel-cream",
    accent: "#F5A623",
    emoji: "✨",
    members: 7,
    tagline: "Bangtan Sonyeondan",
  },
];

export function getGroupById(id: string): Group | undefined {
  return GROUPS.find((g) => g.id === id);
}
