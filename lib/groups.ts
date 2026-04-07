// lib/groups.ts

export interface Group {
  id: string;
  name: string;
  color: string;
  accent: string;
  members: number;
  tagline: string;
  image: string; // Group photo URL
}

export const GROUPS: Group[] = [
  {
    id: "treasure",
    name: "TREASURE",
    color: "#FFD166",
    accent: "#F5A623",
    members: 10,
    tagline: "Find Your Treasure",
    image: "/groups/treasure.jpeg",
  },
  {
    id: "nctdream",
    name: "NCT DREAM",
    color: "#7EC8E3",
    accent: "#4EADE3",
    members: 7,
    tagline: "We Go Up!",
    image: "/groups/nct_dream.jpg",
  },
  {
    id: "nct127",
    name: "NCT 127",
    color: "#FF8FAB",
    accent: "#FF5C8A",
    members: 9,
    tagline: "Neo Culture Technology 127",
    image: "/groups/nct_127.jpg",
  },
  {
    id: "seventeen",
    name: "SEVENTEEN",
    color: "#C9A8FF",
    accent: "#9B59FF",
    members: 13,
    tagline: "13 Members, 3 Units, 1 Team",
    image: "/groups/seventeen.jpg",
  },
  {
    id: "enhypen",
    name: "ENHYPEN",
    color: "#A8E6CF",
    accent: "#56C596",
    members: 7,
    tagline: "Connect the World",
    image: "/groups/enhypen.jpg",
  },
];

export function getGroupById(id: string): Group | undefined {
  return GROUPS.find((g) => g.id === id);
}
