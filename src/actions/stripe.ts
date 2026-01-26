'use server'

import { stripe } from "@/lib/stripe"
import { getAuthenticatedUser } from "./auth"
import Stripe from "stripe"
import { prismaClient } from "@/lib/prismaClient"
import { subscriptionPriceId } from "@/lib/data"
import { PrismaClient } from "@prisma/client"


export const getAllProductsFromStripe =  async () => {
    try {
       const currentUser = await getAuthenticatedUser()
       
    console.log('getAuthenticatedUser result 👉', currentUser);

        if (!currentUser.user) throw new Error('Not logged in');
       const stripeProducts = await stripe.products.list(
        {},
        {
            stripeAccount: currentUser.user.stripeConnectId, 
        }
       )

       return {
        products: products.data,
        status:200,
        success:true
       }

    } catch (error) {
        
    }
}



export async function onGetStripeClientSecret(email: string, userId: string) {
  try {
    // 1️⃣ Find existing customer
    let customers = await stripe.customers.list({ email });
    let customer = customers.data[0];

    if (!customer) {
      customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
    }

   const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // amount in cents, e.g., $50
      currency: 'usd',
      receipt_email: email,
      metadata: {
        userId,
      },
    });

    return { secret: paymentIntent.client_secret };
  } catch (error: any) {
    console.log('Stripe intent response error:', error.message);
    return { status: 400, message: error.message };
  }
}



export const updateSubscription = async (subscription: Stripe.Subscription) => {
    try {
        const   userId = subscription.metadata.userId

        await prismaClient.user.update({
            where: {id: userId},
            data: {
               subscription: subscription.status === 'active' ? true : false,
            },
        })
    } catch (error) {
         console.error('Error updating subscription:', error );
         
    }
}