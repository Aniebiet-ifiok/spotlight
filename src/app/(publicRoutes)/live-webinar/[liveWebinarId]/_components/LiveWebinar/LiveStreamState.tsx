import React from 'react'
import { StreamVideo, StreamVideoClient, User as StreamUser } from '@stream-io/video-react-sdk'

import { User, user } from '@prisma/client'
import { WebinarWithPresenter } from '@/lib/type'
import CustomLiveStreamPlayer from './CustomLiveStreamPlayer'

type Props = {
    apikey: string
    token: string
    callId: string
    webinar: WebinarWithPresenter
    user: User
}

const hostUser: StreamUser =  {id: process.env.NEXT_PUBLIC_STREAM_USER_ID}


const LiveStreamState = ({
    apikey,
    token,
    callId,
    webinar,
    user
}: Props) => {
const client = new StreamVideoClient({apikey, user: hostUser, token})

    return(
   <StreamVideo client={client}>
    <CustomLiveStreamPlayer
    callId={callId}
    callType="livestream"
    webinar={webinar}
    username={user.name}
    token={token}
   />
    </StreamVideo>
    )
}

export default LiveStreamState;