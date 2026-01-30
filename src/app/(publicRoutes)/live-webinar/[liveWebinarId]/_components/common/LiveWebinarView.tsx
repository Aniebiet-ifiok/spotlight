'use client'

import { WebinarWithPresenter } from '@/lib/type'
import { ParticipantView, useCallStateHooks } from '@stream-io/video-react-sdk'
import { StreamChat } from 'stream-chat'
import { Chat, Channel, MessageList, MessageInput } from 'stream-chat-react'
import { Button } from '@/components/ui/button'
import { CtaTypeEnum } from '@prisma/client'
import { MessageSquare, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
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

  const [chatClient, setChatClient] = useState<StreamChat | null>(null)
  const [channel, setChannel] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // -------------------------
  // Initialize Stream Chat
  // -------------------------
  useEffect(() => {
    let clientInstance: StreamChat | null = null

    const initChat = async () => {
      try {
        // Fetch a user-specific token from your server
        const res = await fetch(
          `/api/stream-token?userId=${userId}&username=${username}`
        )
        const data = await res.json()
        const token = data.token

        if (!token) throw new Error('No token returned from server')

        clientInstance = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!)
        await clientInstance.connectUser({ id: userId, name: username }, token)

        const channelInstance = clientInstance.channel('livestream', webinar.id, {
          name: webinar.title,
        })

        await channelInstance.watch()

        setChatClient(clientInstance)
        setChannel(channelInstance)
      } catch (err) {
        console.error('Failed to initialize chat:', err)
      }
    }

    initChat()

    // Cleanup on unmount
    return () => {
      if (clientInstance) clientInstance.disconnectUser()
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

    return () => {
      channel.off(handleEvent)
    }
  }, [chatClient, channel, isHost])

  // -------------------------
  // CTA Button handler
  // -------------------------
  const handleCTAButtonClick = async () => {
    if (!channel) return
    await channel.sendEvent({ type: 'open_cta_dialog' })
  }

  if (!chatClient || !channel) return null

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

      {/* Main Content */}
      <div className="flex flex-1 p-2 gap-2 overflow-hidden">
        {/* Video */}
        <div className="flex-1 rounded-lg overflow-hidden border border-border flex flex-col bg-card">
          <div className="flex-1 relative overflow-hidden">
            {hostParticipant ? (
              <div className="w-full h-full">
                <ParticipantView
                  participant={hostParticipant}
                  className="w-full h-full object-cover !max-w-full"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground flex-col space-y-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <User size={40} className="text-muted-foreground" />
                </div>
                <p>Waiting for Stream to Start...</p>
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
        {showChat && (
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <div className="w-80 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
                <div className="py-2 px-3 border-b border-border font-medium flex items-center justify-between">
                  <span>Chat</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{viewerCount} Viewers</span>
                </div>
                <MessageList className="flex-1 overflow-auto" />
                <MessageInput focus />
              </div>
            </Channel>
          </Chat>
        )}
      </div>

      {/* CTA Dialog */}
      {dialogOpen && (
        <CTADialogBox open={dialogOpen} onOpenCharge={setDialogOpen} webinar={webinar} userId={userId} />
      )}
    </div>
  )
}

export default LiveWebinarView
