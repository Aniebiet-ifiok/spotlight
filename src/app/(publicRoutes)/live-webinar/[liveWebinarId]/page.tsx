"use server"

import { getAuthenticatedUser } from '@/actions/auth'
import { getWebinarById } from '@/actions/webinar'
import RenderWebinar from './_components/RenderWebinar'
import { StreamChat } from 'stream-chat'
import jwt from 'jsonwebtoken'

type Props = {
  params: Promise<{ liveWebinarId: string }>
  searchParams: Promise<{ error?: string }>
}

const Page = async ({ params, searchParams }: Props) => {
  const { liveWebinarId } = await params
  const { error } = await searchParams

  const webinarData = await getWebinarById(liveWebinarId)
  if (!webinarData) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-4xl">
        Webinar not found
      </div>
    )
  }

  const checkUser = await getAuthenticatedUser()
  const userId = checkUser.user?.id || 'guest_user'
  const role = 'admin'

  // ✅ Generate server-side tokens
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!
  const apiSecret = process.env.STREAM_SECRET!

  const chatClient = StreamChat.getInstance(apiKey, apiSecret)
  const chatToken = chatClient.createToken(userId)

  const videoToken = jwt.sign(
    { user_id: userId, role },
    apiSecret,
    { algorithm: 'HS256', expiresIn: '1h', issuer: apiKey }
  )

  return (
    <div className="w-full min-h-screen mx-auto">
      <RenderWebinar
        error={error}
        apiKey={apiKey}
        chatToken={chatToken}
        videoToken={videoToken}
        callId={webinarData.id}
        user={checkUser.user || null}
        webinar={webinarData}
      />
    </div>
  )
}

export default Page
