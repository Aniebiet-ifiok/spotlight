'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Clock, Calendar, Loader2 } from 'lucide-react'

import CountDownTimer from './CountDownTimer'
import WaitListComponent from './WaitListComponent'

import { Button } from '@/components/ui/button'
import { WebinarStatusEnum } from '@prisma/client'
import { changeWebinarStatus } from '@/actions/webinar'
import { toast } from 'sonner'

import type { Webinar, User } from '@prisma/client'

type Props = {
  webinar: Webinar
  currentUser: User | null
}

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const isHost = currentUser?.id === webinar.presenterId

  const handleStartWebinar = async () => {
    setLoading(true)
    try {
      // If the webinar is SCHEDULED, first move it to WAITING_ROOM
      if (webinar.webinarStatus === WebinarStatusEnum.SCHEDULED) {
        const resWaiting = await changeWebinarStatus(webinar.id, 'WAITING_ROOM')
        if (!resWaiting.success) throw new Error(resWaiting.message)
      }

      // Now start the webinar
      const resLive = await changeWebinarStatus(webinar.id, 'LIVE')
      if (!resLive.success) throw new Error(resLive.message)

      toast.success('Webinar started successfully')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[400px] flex-col items-center justify-center gap-8 py-20">
      <div className="space-y-6">
        <p className="text-center text-3xl font-semibold text-primary">
          Seems like you are a little early
        </p>

        <CountDownTimer
          targetDate={webinar.startTime}
          webinarId={webinar.id}
          webinarStatus={webinar.webinarStatus}
          className="text-center"
        />

        <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
          <div className="relative mb-6 aspect-[4/3] w-full max-w-md overflow-hidden rounded-4xl">
            <Image
              src="/darkthumbnail.png"
              alt={webinar.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Presenter sees Start Webinar button even if SCHEDULED */}
          {isHost && (webinar.webinarStatus === WebinarStatusEnum.SCHEDULED || webinar.webinarStatus === WebinarStatusEnum.WAITING_ROOM) ? (
            <Button
              className="w-full max-w-[300px] font-semibold"
              onClick={handleStartWebinar}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                'Start Webinar'
              )}
            </Button>
          ) : webinar.webinarStatus === WebinarStatusEnum.SCHEDULED || webinar.webinarStatus === WebinarStatusEnum.WAITING_ROOM ? (
            <WaitListComponent
              webinarId={webinar.id}
              webinarStatus={webinar.webinarStatus}
            />
          ) : webinar.webinarStatus === WebinarStatusEnum.LIVE ? (
            <WaitListComponent
              webinarId={webinar.id}
              webinarStatus="LIVE"
            />
          ) : webinar.webinarStatus === WebinarStatusEnum.CANCELLED ? (
            <p className="text-center text-red-500">
              Webinar is Cancelled
            </p>
          ) : (
            <Button disabled>Ended</Button>
          )}
        </div>

        {/* Webinar Info */}
        <div className="space-y-4 text-center">
          <h3 className="text-2xl font-semibold text-primary">
            {webinar.title}
          </h3>

          <p className="text-xs text-muted-foreground">
            {webinar.description}
          </p>

          <div className="flex w-full flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              className="rounded-md bg-secondary/60 backdrop-blur-2xl"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {format(new Date(webinar.startTime), 'dd MMMM yyyy')}
            </Button>

            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              {format(new Date(webinar.startTime), 'hh:mm a')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebinarUpcomingState
