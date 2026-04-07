import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPwd = process.env.ADMIN_PASSWORD || "rahasia123";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || "supersecret_haneulid";

  if (username === adminUser && password === adminPwd) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", sessionSecret, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari
    });
    return response;
  }

  return NextResponse.json(
    { success: false, error: "Username atau password salah." },
    { status: 401 }
  );
}
