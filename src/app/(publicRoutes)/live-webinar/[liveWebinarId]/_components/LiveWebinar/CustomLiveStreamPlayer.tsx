'use client'

import {
  StreamCall,
  useStreamVideoClient,
  Call,
} from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import LiveWebinarView from '../common/LiveWebinarView'
import { WebinarWithPresenter } from '@/lib/type'

type Props = {
  username: string
  callId: string
  callType: string
  webinar: WebinarWithPresenter
  userId: string
  isHost: boolean
}

const CustomLiveStreamPlayer = ({
  username,
  callId,
  callType,
  webinar,
  userId,
  isHost,
}: Props) => {
  const client = useStreamVideoClient()
  const [call, setCall] = useState<Call | null>(null)
  const [showChat, setShowChat] = useState(true)

  useEffect(() => {
    if (!client) return

    const myCall = client.call(callType, callId)
    setCall(myCall)

    myCall
      .join({ create: isHost })
      .catch((e) => console.error('Join failed', e))

    return () => {
      myCall.leave().catch(() => {})
    }
  }, [client, callId, callType, isHost])

  if (!call) return null

  return (
    <StreamCall call={call}>
      <LiveWebinarView
        showChat={showChat}
        setShowChat={setShowChat}
        isHost={isHost}
        username={username}
        userId={userId}
        webinar={webinar}
      />
    </StreamCall>
  )
}

export default CustomLiveStreamPlayer
