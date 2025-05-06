import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const exists = await db.user.findUnique({ where: { email } });
    if (exists)
      return NextResponse.json({ error: "Email exists" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 12);

    await db.user.create({
      data: {
        email,
        password: hashed,
        role: "USER",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal error, ${error}` },
      { status: 500 }
    );
  }
}
