'use client'

import { WebinarWithPresenter } from '@/lib/type'
import { ParticipantView, useCallStateHooks, StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk'
import { StreamChat } from 'stream-chat'
import { Chat, Channel, MessageList, MessageInput } from 'stream-chat-react'
import { Button } from '@/components/ui/button'
import { CtaTypeEnum } from '@prisma/client'
import { MessageSquare, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import 'stream-chat-react/dist/css/v2/index.css'
import CTADialogBox from './CTADialogBox'

type Props = {
  showChat: boolean
  setShowChat: (show: boolean) => void
  webinar: WebinarWithPresenter
  isHost: boolean
  username: string
  userId: string
}

const LiveWebinarView = ({
  showChat,
  setShowChat,
  webinar,
  isHost,
  username,
  userId,
}: Props) => {
  const { useParticipantCount, useParticipants } = useCallStateHooks()
  const participants = useParticipants()
  const viewerCount = useParticipantCount()
  const hostParticipant = participants.length > 0 ? participants[0] : null

  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null)
  const [chatClient, setChatClient] = useState<StreamChat | null>(null)
  const [channel, setChannel] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // -------------------------
  // Initialize Stream Video & Chat
  // -------------------------
  useEffect(() => {
    let chatInstance: StreamChat | null = null
    let videoInstance: StreamVideoClient | null = null

    const init = async () => {
      try {
        const res = await fetch(`/api/stream-token?userId=${userId}&username=${username}&role=admin`)
        if (!res.ok) throw new Error(`Failed to fetch token: ${res.status}`)

        const data = await res.json()
        const videoToken = data.videoToken
        const chatToken = data.chatToken

        if (!videoToken) throw new Error('No video token returned from server')
        if (!chatToken) throw new Error('No chat token returned from server')

        // Video client
        videoInstance = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
          user: { id: userId, name: username },
          token: videoToken,
        })
        setVideoClient(videoInstance)

        // Chat client
        chatInstance = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!)
        await chatInstance.connectUser({ id: userId, name: username }, chatToken)
        const channelInstance = chatInstance.channel('livestream', webinar.id, { name: webinar.title })
        await channelInstance.watch()
        setChatClient(chatInstance)
        setChannel(channelInstance)

        setLoading(false)
      } catch (err: any) {
        console.error('Failed to initialize live webinar:', err)
        setError(err.message || 'Unknown error')
        setLoading(false)
      }
    }

    init()

    return () => {
      chatInstance?.disconnectUser()
      videoInstance?.disconnectUser?.()
    }
  }, [userId, username, webinar.id, webinar.title])

  // -------------------------
  // Listen for CTA events
  // -------------------------
  useEffect(() => {
    if (!chatClient || !channel) return

    const handleEvent = (event: any) => {
      if (event.type === 'open_cta_dialog' && !isHost) {
        setDialogOpen(true)
      }
    }

    channel.on(handleEvent)
    return () => channel.off(handleEvent)
  }, [chatClient, channel, isHost])

  // -------------------------
  // CTA Button
  // -------------------------
  const handleCTAButtonClick = async () => {
    if (!channel) return
    await channel.sendEvent({ type: 'open_cta_dialog' })
  }

  // -------------------------
  // Render
  // -------------------------
  if (loading) return <div className="text-center mt-10">Loading live stream...</div>
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="bg-accent-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive animate-pulse"></span>
            </span>
            LIVE
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-muted/50 px-3 py-1 rounded-full">
            <User size={16} />
            <span className="text-sm">{viewerCount}</span>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
              showChat ? 'bg-accent-primary text-primary-foreground' : 'bg-muted/50'
            }`}
          >
            <MessageSquare size={16} />
            <span>Chat</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 p-2 gap-2 overflow-hidden">
        {/* Video */}
        <div className="flex-1 rounded-lg overflow-hidden border border-border flex flex-col bg-card">
          <div className="flex-1 relative overflow-hidden">
            {hostParticipant ? (
              <ParticipantView
                participant={hostParticipant}
                className="w-full h-full object-cover !max-w-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground flex-col space-y-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <User size={40} className="text-muted-foreground" />
                </div>
                <p>Waiting for host to start the stream...</p>
              </div>
            )}

            {isHost && (
              <div className="absolute top-4 right-4 bg-background backdrop-blur-sm py-1 px-3 rounded-full text-sm font-medium">
                Host
              </div>
            )}
          </div>

          {/* Webinar Footer / CTA */}
          <div className="p-2 border-t border-border flex items-center justify-between py-2">
            <div className="text-sm font-medium capitalize">{webinar?.title}</div>
            {isHost && (
              <Button onClick={handleCTAButtonClick}>
                {webinar.ctaType === CtaTypeEnum.BOOK_A_CALL ? 'Book a Call' : 'Buy Now'}
              </Button>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && chatClient && channel && (
  <Chat client={chatClient}>
    <Channel channel={channel}>
      <div
        className="w-80 rounded-xl overflow-hidden flex flex-col shadow-lg"
        style={{
          backgroundImage: 'url("/images/abstract-green.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
        }}
      >
        {/* Header */}
        <div className="py-2 px-3 border-b border-white/30 font-medium flex items-center justify-between bg-white/10 backdrop-blur-sm text-white">
          <span className="text-lg font-semibold">Live Chat</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{viewerCount} Viewers</span>
        </div>

        {/* Messages */}
        <MessageList
          className="flex-1 overflow-auto p-2 space-y-2"
          messageClassName="!bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white"
        />

        {/* Input */}
        <MessageInput
          focus
          className="border-t border-white/30 p-2 bg-white/10 text-white placeholder-white/70 rounded-b-xl"
        />
      </div>
    </Channel>
  </Chat>
)}

      </div>

      {/* CTA Dialog */}
      <CTADialogBox open={dialogOpen} onOpenChange={setDialogOpen} webinar={webinar} userId={userId} />
    </div>
  )
}

export default LiveWebinarView
