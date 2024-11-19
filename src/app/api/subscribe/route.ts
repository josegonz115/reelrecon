import { NextRequest, NextResponse } from "next/server";
import { subscribeUser } from "@/pwa/actions";

export async function POST(req: NextRequest) {
    const subscription = await req.json();
    const result = await subscribeUser(subscription);
    return NextResponse.json(result);
}
