import { User } from '@prisma/client'
import React, { useState } from 'react'
import {CardElement, useElements} from '@stripe/react-stripe-js'
import {useStripe} from '@stripe/react-stripe-js'
import {useRouter} from 'next/navigation'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, PlusIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { onGetStripeClientSecret } from '@/actions/stripe'



type Props = {
    user:User | null
}


const SubscriptionModal = ({user}: Props) => {
    const router = useRouter()
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)


   // Async function (because you use await inside)
const handleConfirm = async () => {
  try {
    setLoading(true);

    if (!user) {
      toast.error('You must be logged in to subscribe');
      return;
    }

    if (!stripe || !elements) {
      toast.error('Stripe not initialized');
      return;
    }

    const intent = await onGetStripeClientSecret(user.email, user.id);

    if (!intent?.secret) {
      throw new Error('Failed to initialize payment');
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      throw new Error('Card element not found');
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      intent.secret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      throw new Error(error.message || 'Payment failed');
    }

    toast.success('Subscription successful 🎉');
    console.log('payment successful:', paymentIntent);

    router.refresh();
  } catch (error) {
    console.log('SUBSCRIPTION ---->', error);
    toast.error('Failed to update subscription');
  } finally {
    setLoading(false);
  }
};


    return(
        <Dialog>
            <DialogTrigger asChild>
               <button className='rounded-xl flex gap-2 items-center hover:cursor-pointer px-4 py-2 border border-border bg-primary/10 backdrop-blur-sm text-sm font-normal text-primary hover:bg-primary-20'>
                 <PlusIcon />
                 Create Webinar
               </button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] '>
                <DialogHeader>
                    <DialogTitle >
                        Spotlight Subscription
                    </DialogTitle>
                </DialogHeader>
                <CardElement 
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#B4B0AE',
                            '::placeholder': {
                                color: '#B4B0AE',
                            },
                        },
                    },
                }}
                className='border-[1px] outline-none rounded-lg p-3 w-full'/>
                  <DialogFooter className='gap-4 items-center'>
                <DialogClose className='w-full sm:w-auto border border-border rounded-md px-3 py-2 '
                disabled={loading}>
                Cancel
                </DialogClose>
                <Button
                type="submit"
                className='w-full sm:w-auto'
                onClick={handleConfirm}
                disabled={loading} >
                  {loading ? (
                    <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Loading....
                    </>
                  ) : (
                    'Confirm' 
                  )}
                </Button>
            </DialogFooter>
            </DialogContent>
          
        </Dialog>
    )
}

export default SubscriptionModal;