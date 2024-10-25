import { NextResponse } from "next/server";

export default function GET(){

    return NextResponse.json("Get Users")
}

export default function POST(){

    return NextResponse.json("Post Users")
}

