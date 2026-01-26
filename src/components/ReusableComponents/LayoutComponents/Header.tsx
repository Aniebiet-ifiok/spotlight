"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../../ui/button";
import { ArrowLeft, Zap } from "lucide-react";
import Purpleicon from "./Purpleicon";
import CreateWebinarButton from "../CreateWebinarButton";
import StripeElements from "../stripe/Element";
import SubscriptionModal from "../SubscriptionModal";
import Stripe from "stripe";

type Props = {
  stripeProducts: Stripe.Product[] | [];
};

const Header = ({ stripeProducts }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  // Clerk user
  const { user, isLoaded } = useUser();

  // Local subscription state (optional, in case user object updates)
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Wait for Clerk to load
  useEffect(() => {
    if (!isLoaded) return;

    console.group("🧠 HEADER DEBUG");
    console.log("USER 👉", user);
    console.log("SUBSCRIPTION 👉", user?.subscription);
    console.log("SUBSCRIPTION TYPE 👉", typeof user?.subscription);
    console.groupEnd();

    setIsSubscribed(Boolean(user?.subscription));
  }, [isLoaded, user]);

  // Render nothing until user is loaded
  if (!isLoaded) return null;

  return (
    <div className="w-full px-4 pt-10 pb-10 sticky top-0 z-10 flex justify-between items-center flex-wrap gap-4 bg-background">
      {/* Back button / Page title */}
      {pathname.includes("pipeline") ? (
        <Button
          className="bg-primary/10 border border-border rounded-xl"
          variant="outline"
          onClick={() => router.push("/webinars")}
        >
          <ArrowLeft /> Back to Webinars
        </Button>
      ) : (
        <div className="px-4 py-2 flex justify-center items-center rounded-xl bg-background border border-border text-primary capitalize">
          {pathname.split("/")[1]}
        </div>
      )}

      {/* Stripe / Create Webinar */}
      <div className="flex gap-6 items-center flex-wrap">
        <Purpleicon>
          <Zap className="w-6 h-6 text-white" />
        </Purpleicon>

        {isSubscribed ? (
          <>
            {console.log(" USER IS SUBSCRIBED — SHOW CREATE BUTTON")}
            <CreateWebinarButton stripeProducts={stripeProducts} />
          </>
        ) : (
          <>
            {console.log(" USER NOT SUBSCRIBED — SHOW STRIPE MODAL")}
            <CreateWebinarButton stripeProducts={stripeProducts} />

           {/* <StripeElements>
              <SubscriptionModal />
            </StripeElements> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
