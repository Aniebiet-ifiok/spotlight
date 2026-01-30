'use client'

import { registerAttendee } from '@/actions/attendance'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAttendeeStore } from '@/store/useAttendeeStore'
import { WebinarStatusEnum } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  webinarId: string
  webinarStatus: WebinarStatusEnum
  onRegistered?: () => void
}

const WaitListComponent = ({
  webinarId,
  webinarStatus,
  onRegistered,
}: Props) => {
  // ✅ FIX: must be strings, not booleans
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const router = useRouter()
  const { setAttendee } = useAttendeeStore()

  const buttonText = () => {
    switch (webinarStatus) {
      case WebinarStatusEnum.SCHEDULED:
      case WebinarStatusEnum.WAITING_ROOM:
        return 'Get Reminder'
      case WebinarStatusEnum.LIVE:
        return 'Join Webinar'
      default:
        return 'Register'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email) {
      toast.error('Please enter your name and email')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await registerAttendee({
        webinarId,
        name,
        email,
      })

      if (!res?.success) {
        throw new Error(res?.message || 'Failed to register')
      }

      if (res.data?.user) {
        setAttendee({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          callStatus: 'PENDING',
        })
      }

      toast.success(
        webinarStatus === WebinarStatusEnum.LIVE
          ? 'Successfully joined the webinar'
          : 'Successfully registered for webinar'
      )

      setSubmitted(true)
      setName('')
      setEmail('')

      setTimeout(() => {
        setIsOpen(false)

        // ✅ IMPORTANT: navigate into the live room
        if (webinarStatus === WebinarStatusEnum.LIVE) {
          router.push(`/webinars/${webinarId}/live`)
        }

        if (onRegistered) onRegistered()
      }, 1200)
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={`${
            webinarStatus === WebinarStatusEnum.LIVE
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-primary hover:bg-primary/90'
          } rounded-md px-4 py-2 text-primary-foreground text-sm font-semibold`}
        >
          {webinarStatus === WebinarStatusEnum.LIVE && (
            <span className="mr-2 h-2 w-2 bg-white rounded-full animate-pulse" />
          )}
          {buttonText()}
        </Button>
      </DialogTrigger>

      <DialogContent className="border-0" isHideCloseButton>
        <DialogHeader className="items-center p-4">
          <DialogTitle className="text-lg text-center font-semibold mb-4">
            {webinarStatus === WebinarStatusEnum.LIVE
              ? 'Join the webinar'
              : 'Join the waitlist'}
          </DialogTitle>

          <Form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full"
          >
            {!submitted && (
              <>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || submitted}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  {webinarStatus === WebinarStatusEnum.LIVE
                    ? 'Joining...'
                    : 'Registering...'}
                </>
              ) : submitted ? (
                webinarStatus === WebinarStatusEnum.LIVE
                  ? 'Redirecting to webinar...'
                  : "You're on the waitlist"
              ) : webinarStatus === WebinarStatusEnum.LIVE ? (
                'Join'
              ) : (
                'Join Waitlist'
              )}
            </Button>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default WaitListComponent
