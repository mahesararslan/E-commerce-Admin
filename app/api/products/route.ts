import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const data = await req.json();
    console.log(data);
    
    return NextResponse.json({
        received: data,
        status: 200
    });
}