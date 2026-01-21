"use server"

import { WebinarFormState } from "@/store/useWebinarStore"
import { getAuthenticatedUser } from "./auth"
import { prismaClient } from "@/lib/prismaClient"
import { revalidatePath } from "next/cache"



function combineDateTime(
    date: Date,
    timeStr: string,
    timeFormat: 'AM' | 'PM'
): Date {
    const [hoursStr, minutesStr] = timeStr.split(':')
    let hours = Number.parseInt(hoursStr, 10)
    const minutes = Number.parseInt(minutesStr || '0', 10)


    if(timeFormat === 'PM' && hours < 12){
        hours += 12
    }else if (timeFormat === 'AM' && hours === 12){
        hours = 0
    }



    const result = new Date(date)
    result.setHours(hours, minutes, 0, 0)
    return result
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


if (combinedDateTime < now){
    return{
        status: 400, 
        message: 'webinar date and time cannot be in the past '
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