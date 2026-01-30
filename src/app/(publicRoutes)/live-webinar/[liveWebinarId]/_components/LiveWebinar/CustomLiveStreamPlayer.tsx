'use client'

import { WebinarWithPresenter } from '@/lib/type'
import { StreamCall, useStreamVideoClient } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import LiveWebinarView from '../common/LiveWebinarView'


type Props = {
    username: string
    callId: string
    callType: string
    webinar: WebinarWithPresenter
    token: string
}

const CustomLiveStreamPlayer = ({username, callId, callType, webinar, token}: Props) => {
        const client = useStreamVideoClient()
const [call, setCall] = useState<call>()
const [showChat, setShowChat] = useState(true)


useEffect(()=> {
  if(!client) return 
  const myCall =  client.call(callType, callId)
  setCall(myCall)
  myCall.join().catch((e) => {
    console.error('failed to fetch call', e)
  })

  return () => {
    myCall.leave().catch((e) => {
    console.error('failed to leave call', e)
  })
 setCall(undefined)
}


}, [client, callId, callType])

if(!call) return null
   return <StreamCall   call={call}>
    <LiveWebinarView
    showChat={showChat}
    setShowChat={setShowChat}
    isHost={true}
    username={username}
    userId={process.env.NEXT_PUBLIC_STREAM_USER_ID}
    userToken={token}
    webinar={webinar}
    />
   </StreamCall>
}

export default CustomLiveStreamPlayer