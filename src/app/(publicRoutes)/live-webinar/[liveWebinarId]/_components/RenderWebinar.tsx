'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { StreamChat } from 'stream-chat'
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk'
import { WebinarStatusEnum, User } from '@prisma/client'
import WebinarUpcomingState from './UpcomingWebinar/page'
import LiveStreamState from './LiveWebinar/LiveStreamState'
import { WebinarWithPresenter } from '@/lib/type'

type RenderWebinarProps = {
  apiKey: string
  chatToken: string
  videoToken: string
  callId: string
  user: User | null
  webinar: WebinarWithPresenter
  error?: string
}

const RenderWebinar: React.FC<RenderWebinarProps> = ({
  apiKey,
  chatToken,
  videoToken,
  callId,
  user,
  webinar,
  error,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [chatClient, setChatClient] = useState<StreamChat | null>(null)
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null)

  // Handle error notifications
  useEffect(() => {
    if (error) {
      toast.error(error)
      router.push(pathname)
    }
  }, [error])

  // Initialize Stream clients only if user is present
  useEffect(() => {
    if (!user) return

    const chat = new StreamChat(apiKey)
    chat.connectUser({ id: user.id, name: user.name }, chatToken)
    setChatClient(chat)

    const video = new StreamVideoClient(apiKey, videoToken)
    setVideoClient(video)

    return () => {
      chat.disconnectUser()
      video.disconnectUser?.()
    }
  }, [user, apiKey, chatToken, videoToken])

  // Loading state for Stream clients
  if (!chatClient || !videoClient) {
    return <div className="text-center mt-10">Loading webinar...</div>
  }

  // Handle different webinar statuses
  if (
    webinar.webinarStatus === WebinarStatusEnum.SCHEDULED ||
    webinar.webinarStatus === WebinarStatusEnum.WAITING_ROOM
  ) {
    return <WebinarUpcomingState webinar={webinar} currentUser={user} />
  }

  if (webinar.webinarStatus === WebinarStatusEnum.LIVE && user) {
    return (
      <LiveStreamState
        apiKey={apiKey}
        callId={callId}
        webinar={webinar}
        user={user}
        chatClient={chatClient}
        videoClient={videoClient}
      />
    )
  }

  // Default fallback
  return <WebinarUpcomingState webinar={webinar} currentUser={user} />
}

export default RenderWebinar
