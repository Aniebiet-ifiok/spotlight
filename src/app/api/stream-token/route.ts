import { NextRequest, NextResponse } from "next/server"
import { StreamChat } from "stream-chat"
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")
    const username = url.searchParams.get("username")
    const role = url.searchParams.get("role") || "viewer"

    if (!userId || !username) {
      return NextResponse.json({ error: "Missing userId or username" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!
    const apiSecret = process.env.STREAM_SECRET!

    // -----------------------
    // 1. Video Token
    // -----------------------
    const videoToken = jwt.sign(
      {
        user_id: userId,
        name: username,
        role,
      },
      apiSecret,
      { expiresIn: "1h", algorithm: "HS256" }
    )

    // -----------------------
    // 2. Chat Token (server-side only)
    // -----------------------
    const chatClient = StreamChat.getInstance(apiKey, apiSecret)
    const chatToken = chatClient.createToken(userId)

    // -----------------------
    // 3. Return both tokens
    // -----------------------
    return NextResponse.json({ videoToken, chatToken, apiKey })
  } catch (err: any) {
    console.error("Error generating Stream token:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
