import { loadDataIntoPinecone } from "@/utils/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request, res:Response) {
    try {
        const body = await req.json()
        const {data} = body
        // console.log(data)
        await loadDataIntoPinecone(data)
        return NextResponse.json({
            message: "Data loaded successfully"
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: "Internal server errror",

        })
    }
}