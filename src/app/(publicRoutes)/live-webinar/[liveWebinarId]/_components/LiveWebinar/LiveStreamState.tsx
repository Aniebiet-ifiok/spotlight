'use client'

import { useEffect, useState } from "react"
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk"
import CustomLiveStreamPlayer from "./CustomLiveStreamPlayer"
import { WebinarWithPresenter } from "@/lib/type"
import { User } from "@prisma/client"

type Props = {
  apiKey: string
  callId: string
  webinar: WebinarWithPresenter
  user: User
}

const LiveStreamState = ({ apiKey, callId, webinar, user }: Props) => {
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const init = async () => {
      try {
        const res = await fetch(
          `/api/stream-token?userId=${user.id}&username=${user.name}&role=admin`
        )

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)

        const data = await res.json()
        if (!data.videoToken) throw new Error("No video token returned")

        const videoClient = new StreamVideoClient({
          apiKey,
          user: { id: user.id, name: user.name },
          token: data.videoToken,
        })

        setClient(videoClient)
      } catch (err: any) {
        console.error("Failed to initialize StreamVideoClient:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [apiKey, user])

  if (loading) return <div className="text-center mt-10">Loading live stream...</div>
  if (error) return <div className="text-red-500 mt-10 text-center">{error}</div>
  if (!client) return null

  return (
    <StreamVideo client={client}>
      <CustomLiveStreamPlayer
        callId={callId}
        callType="livestream"
        webinar={webinar}
        username={user.name}
        userId={user.id}
        isHost
      />
    </StreamVideo>
  )
}

export default LiveStreamState
