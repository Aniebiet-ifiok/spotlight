'use client'


import React from 'react'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Button } from '../../ui/button'
import { ArrowLeft, Zap } from 'lucide-react'
import Purpleicon from './Purpleicon/index'
import CreateWebinarButton from '../CreateWebinarButton'
import Stripe from 'stripe'
import StripeElements from '../stripe/Element'
import SubscriptionModal from '../SubscriptionModal'

type Props = {
  user: User | null;
  stripeProducts: Stripe.Product[] | []
};


// TODO: STRIPE SUBSCRIPTION, assistant, 
const Header = ({ user, stripeProducts }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full px-4 pt-10 pb-10 sticky top-0 z-10 flex justify-between items-center flex-wrap gap-4 bg-background">
      {pathname.includes("pipeline") ? (
        <Button
          className="bg-primary/10 border border-border rounded-xl"
          variant={"outline"}
          onClick={() => router.push("/webinars")}
        >
          <ArrowLeft /> Back to Webinars
        </Button>
      ) : (
        <div className="px-4 py-2 flex justify-center text-bold items-center rounded-xl bg-background border border-border text-primary capitalize">
          {pathname.split("/")[1]}
        </div>
      )}

  {/* TODO: bUILD STRIPE SUBSCRIPTION AND CREATE WEBINAR  */}
     <div className="flex gap-6 items-center flex-wrap">
  <Purpleicon>
    <Zap className="w-6 h-6 text-white" />
  </Purpleicon>

  {user?.subscription ? (
    <CreateWebinarButton stripeProducts={stripeProducts} />
  ) : (
    <StripeElements>
      <SubscriptionModal user={user}/>
    </StripeElements>
  )
  }
</div>

    </div>
  );
};


export default Header