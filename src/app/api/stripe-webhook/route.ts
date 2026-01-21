import { updateSubscription } from "@/actions/stripe";
import { stripe } from "@/lib/stripe";
import { log } from "console";
import { Webhook } from "lucide-react";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";



const STRIPE_SUBSCRIPTION_EVENTS = new set([
    'invoice.created',
    'invoice.finalized',
    'invoice.paid',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
]);

const getStripeEvent = async (
    body: string,
    sig: string | null
) : Promise<Stripe.Event> => {
    const webhookSecret =  process.env.STRIPE_WEBHOOK_SECRET

    if(!sig || webhookSecret){
        throw new Error('Stripe signatureor webhook secret missing')
    }

    return stripe.webhooks.constructEvent(body, sig, webhookSecret)
}

export async  function POST(req: NextRequest) {
    console.log('Received Stripe webhook event')
    const body = await req.text()

    const signature = (await headers()).get('Stripe-Signature')

    try {
         const stripeEvent = await getStripeEvent(body, signature)
         if(!STRIPE_SUBSCRIPTION_EVENTS.has(stripeEvent.type)){
            console.log('unhandled irrelevant!', stripeEvent.type)
            return NextResponse.json({ received: true }, { status: 200 })
         }


         const event = stripeEvent.data.object as Stripe.Subscription
         const metadata = event.metadata;

         if(
            metadata.connectAccountpayments ||
            metadata.connectAccountSubscriptions
         ){
            console.log('skipping connected account subscription event')
            return NextResponse.json(
                {message: 'skipping connected account event'},
                { status: 200}
            )
         }




         switch (stripeEvent.type){
            case 'checkout.session.completed':
                case 'customer.subscription.created':
                    await updateSubscription(event)
                    console.log('CREATED FROM WEBHOOK', event);
                    return NextResponse.json (
                        {received: true}, {status: 200}
                    )
                    default:
                        console.log('unhandled relevant event', stripeEvent.type);
                        return NextResponse.json(
                            {received:true}, {status: 200}
                        )
                        
                    
         }
    } catch (error: any) {
        console.error('webhook processing error', error);
        return new NextResponse(`webhook error ${error.message}`, {
            status: error.statusCode || 500,
        })
        
    }
}