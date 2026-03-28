# ✨ K-Pop Gacha Box

A cute K-pop photocard blind box gacha website built with Next.js, React, TypeScript, and Tailwind CSS.

---

## 🎯 Features

- **Mobile-first** cute Korean-style UI (pastel pink, cream, baby blue)
- **4 K-pop groups**: NCT, SEVENTEEN, STRAY KIDS, BTS
- **Equal probability** gacha — every member has the same chance
- **Secure token system** — pay → get token → open one box
- **Beautiful animations** — box opening, card reveal, confetti
- **Full user flow**: Landing → Group Select → Payment → Gacha → Result

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
kpop-gacha/
├── app/
│   ├── page.tsx              # Landing page
│   ├── group/page.tsx        # Group selection
│   ├── payment/page.tsx      # Payment page
│   ├── gacha/page.tsx        # Gacha (box opening)
│   ├── result/page.tsx       # Result reveal
│   ├── layout.tsx            # Root layout
│   └── api/
│       ├── create-transaction/route.ts   # Create gacha token
│       ├── verify-payment/route.ts       # Verify payment proof
│       └── gacha/route.ts                # Run gacha logic
│
├── components/
│   ├── StarBackground.tsx    # Animated star background
│   ├── MascotLogo.tsx        # SVG mascot/logo
│   ├── MysteryBox.tsx        # Clickable mystery box
│   ├── PhotocardResult.tsx   # Photocard display card
│   ├── Confetti.tsx          # Confetti celebration
│   ├── TokenDisplay.tsx      # Token copy widget
│   └── GroupCard.tsx         # Group selection card
│
├── data/
│   └── gachaPool.json        # Photocard pool for all groups
│
├── lib/
│   ├── transactionStore.ts   # In-memory transaction store
│   ├── tokenGenerator.ts     # Token generation utility
│   └── groups.ts             # Group configuration
│
└── public/
    ├── qris.png              # Your QRIS payment image
    └── cards/
        ├── nct/              # NCT photocard images
        ├── seventeen/        # SEVENTEEN photocard images
        ├── straykids/        # STRAY KIDS photocard images
        └── bts/              # BTS photocard images
```

---

## 🖼️ Adding Photocard Images

Place images in `public/cards/{group}/`:

```
public/cards/nct/taeyong.jpg
public/cards/nct/jaemin.jpg
...
public/cards/bts/jungkook.jpg
```

The filenames should match the `image` field in `data/gachaPool.json`.

---

## 💳 QRIS Setup

Replace `public/qris.png` with your actual QRIS payment code image.

---

## 🗄️ Production Database

The current implementation uses an **in-memory store** which resets on server restart.

For production, replace `lib/transactionStore.ts` with:
- **Vercel KV** (Redis)
- **PlanetScale** / **Supabase** (SQL)
- **MongoDB Atlas**

---

## 🔐 Security Notes

- Each token can only be used **once**
- Tokens must have `status: "paid"` to access the gacha
- Payment verification is auto-approved (replace with real payment gateway in production)

---

## 🎨 Customization

Edit `lib/groups.ts` to add/remove groups.

Edit `data/gachaPool.json` to add/remove members.

All items have **equal probability** — no rarity system.

---

## 📦 Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Nunito** (Google Fonts)

---

Made with 💕 for K-pop fans!
