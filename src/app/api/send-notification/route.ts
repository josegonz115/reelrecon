import { NextRequest, NextResponse } from "next/server";
import { sendNotification } from "@/pwa/actions";

export async function POST(req: NextRequest){
    const { message } = await req.json();
    const result = await sendNotification(message);
    return NextResponse.json(result);
}
