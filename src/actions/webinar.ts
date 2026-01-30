"use server"

import { WebinarFormState } from "@/store/useWebinarStore"
import { getAuthenticatedUser } from "./auth"
import { prismaClient } from "@/lib/prismaClient"
import { revalidatePath } from "next/cache"
import { WebinarStatusEnum } from "@prisma/client"



function combineDateTime(
    date: string | Date,
    timeStr: string,
    timeFormat: 'AM' | 'PM'
): Date {
    const [hoursStr, minutesStr] = timeStr.split(':')
    let hours = parseInt(hoursStr, 10)
    const minutes = parseInt(minutesStr || '0', 10)

    if (timeFormat === 'PM' && hours < 12) hours += 12
    else if (timeFormat === 'AM' && hours === 12) hours = 0

    let d: Date
    if (typeof date === 'string') {
        // Parse date string in YYYY-MM-DD format as local time
        const [year, month, day] = date.split('-').map(Number)
        d = new Date(year, month - 1, day, hours, minutes, 0, 0)
    } else {
        d = new Date(date)
        d.setHours(hours, minutes, 0, 0)
    }

    return d
}



export const createWebinar = async(FormData: WebinarFormState) => {
   try {
    const user = await getAuthenticatedUser()

    if(!user.user) {
        return {status: 401, message: 'Unauthorized'}
    }


    // TODO: CHECK IF USER HAS SUBSCRIPTION
//   if(!user.user.subscription) {
//         return {status: 402, message: 'Subscription Required'}
//     }

const presenterId = user.user.id

console.log('form data:', FormData, presenterId)

if(!FormData.basicInfo.webinarName) {
    return {status: 404, message: 'Webinar name is required'}
}

if(!FormData.basicInfo.webinarName) {
    return {status: 404, message: 'Webinar name is required'}
}

if(!FormData.basicInfo.webinarName) {
    return {status: 404, message: 'Webinar name is required'}
}


const combinedDateTime = combineDateTime(
    FormData.basicInfo.date,
    FormData.basicInfo.time,
    FormData.basicInfo.timeFormat || 'AM'
)

const now = new Date()

// Minimum buffer of 2 minutes
const MIN_BUFFER_MINUTES = 2
const minAllowedTime = new Date(now.getTime() + MIN_BUFFER_MINUTES * 60 * 1000)

console.log('Now:', now)
console.log('Combined Webinar Time:', combinedDateTime)
console.log('Minimum Allowed Time:', minAllowedTime)

if (combinedDateTime < minAllowedTime) {
    return {
        status: 400,
        message: `Webinar must start at least ${MIN_BUFFER_MINUTES} minutes in the future`
    }
}





const Webinar =  await prismaClient.webinar.create({
     data: {
        title: FormData.basicInfo.webinarName,
        description: FormData.basicInfo.description || '',
        startTime: combinedDateTime,
        tags: FormData.cta.tags || [],
        ctaLabel: FormData.cta.ctaLabel,
        ctaType: FormData.cta.ctaType,
        aiAgentId: FormData.cta.aiAgent || null,
        priceId: FormData.cta.priceId || null,
        lockChat: FormData.additionalInfo.lockChat || false,
        couponCode: FormData.additionalInfo.couponEnabled
        ? FormData.additionalInfo.couponCode
        : null,
        couponEnabled: FormData.additionalInfo.couponEnabled || false,
        presenterId: presenterId,
     },
})


revalidatePath('/')


return {
    status: 200,
    message: 'Webinar Created Succeffully',
    webinarId: Webinar.id,
    webinarLink: `/webinar${Webinar.id}`
}
   } catch (error) {
      console.error(  'Error creating webinar:', error )
      return {
        status: 500,
        message: 'Failed to Create Webinar. Pleae Try again.'
      }
   }
}  


export const getWebinarByPresenterId = async (presenterId: string) => {
    try {
        const webinars = await prismaClient.webinar.findMany({
            where: { presenterId },
            include: {
               presenter: {
                 select:{
                    name:true,
                    stripeConnectId: true,
                    id:true,
                },
               },
            },
        })

        return webinars
    } catch (error) {
         console.error('Error getting webinars:', error)
         return []
    }
}



export const getWebinarById = async (webinarId: string) => {
   try {
    const webinar = await prismaClient.webinar.findUnique({
        where: {id: webinarId},
        include: {
            presenter: {
                select: {
                    id: true,
                    name:true,
                    profileImage:true,
                    stripeConnectId:true,
                },
            },
        },
    })

    return webinar
   } catch (error) {
      console.error('Error fetching webinar', error)
      throw new Error('Failed to fetch webinar')
   }
} 

export const changeWebinarStatus = async (
    webinarId: string,
    status: WebinarStatusEnum
) => {
    try {
        const webinar = await prismaClient.webinar.update({
            where: {
                id: webinarId,
            },
            data: {
                webinarStatus: status,
            },
        })
        return {
            status:200,
            success: true,
            message: 'webinar status updated successfully',
            data: webinar,
        }
    } catch (error) {
        console.error('Erorr updating webinar status:', error)
        return {
            status: 500,
            success: false,
            message: 'Failed to update webinar status'
        }
    }
}


