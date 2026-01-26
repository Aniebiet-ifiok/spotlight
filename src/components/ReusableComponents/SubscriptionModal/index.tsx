"use client";

import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon } from "lucide-react";
import { onGetStripeClientSecret } from "@/actions/stripe";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";



const SubscriptionModal = () => {
  const { user, isLoaded } = useUser();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isLoaded) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);

      if (!user) {

        toast.error("You must be logged in to subscribe");
        console.log("You must be logged in to subscribe");
        return;
      } else {
        console.log("user found");
       
      }

      if (!stripe || !elements) {
        toast.error("Stripe not initialized");
        return;
      }

      const intent = await onGetStripeClientSecret(user.email, user.id);
console.log("Stripe intent response:", intent);

      if (!intent?.secret) throw new Error("Failed to initialize payment");

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intent.secret,
        { payment_method: { card: cardElement } }
      );

      if (error) throw new Error(error.message || "Payment failed");

      toast.success("Subscription successful 🎉");
      alert("Subscription successful 🎉");
      router.refresh();
    } catch (err: any) {
      console.log("SUBSCRIPTION ERROR --->", err);
      toast.error("Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-xl flex gap-2 items-center px-4 py-2 border border-border bg-primary/10 backdrop-blur-sm text-sm font-normal text-primary hover:bg-primary-20">
          <PlusIcon />
          Create Webinar
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Spotlight Subscription</DialogTitle>
        </DialogHeader>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#B4B0AE",
                "::placeholder": { color: "#B4B0AE" },
              },
            },
          }}
          className="border-[1px] outline-none rounded-lg p-3 w-full"
        />
        <DialogFooter className="gap-4 items-center">
          <DialogClose
            className="w-full sm:w-auto border border-border rounded-md px-3 py-2"
            disabled={loading}
          >
            Cancel
          </DialogClose>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading....
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
