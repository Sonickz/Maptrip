import { NextResponse } from "next/server";

export function GET(){

    return NextResponse.json("Get Users")
}

export function POST(){

    return NextResponse.json("Post Users")
}

