import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const frame = await data.frame;

  return NextResponse.json({ message: "Success" }, { status: 200 });
}
