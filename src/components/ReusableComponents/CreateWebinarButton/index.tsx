"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useWebinarStore } from "@/store/useWebinarStore";
import MultiStepForm from "./MultiStepForm";
import BasicInfoStep from "./BasicInfoStep";
import CTAStep from "./CTAStep";
import AdditionalInfoStep from "./additionalInfoStep";
import Stripe from "stripe";

type Props = {
  stripeProducts: Stripe.Product[] | []
};

const CreateWebinarButton = ({stripeProducts}: Props) => {
  const {
    isModalOpen,
    setModalOpen,
    isComplete,
    setComplete,
  } = useWebinarStore();

  const [webinarLink, setWebinarLink] = useState("");

  const steps = [
    {
      id: "basicInfo",
      title: "Basic Information",
      description: "Please fill out the standard info needed for your webinar",
      component: <BasicInfoStep />,
    },

     {
      id: "cta",
      title: "CTA",
      description: "Please provide the end-point for your customer through your webinar",
      component:  <CTAStep 
      assistants={[]}
      stripeProducts={stripeProducts}
      />
    },


      {
      id: "additionalInfo",
      title: "Additional Information",
      description: "Please fill information about additional options if neccessary",
      component:  <AdditionalInfoStep
      />
    },
  ];

  const handleComplete = (webinarId: string) => {
    setComplete(true);

    setWebinarLink(
      `${process.env.NEXT_PUBLIC_BASE_URL}/live-webinar/${webinarId}`
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <button
          className="
            flex items-center gap-2
            rounded-xl px-4 py-2
            border border-border
            bg-primary/10 backdrop-blur-sm
            text-sm font-normal text-primary
            hover:bg-primary/20
            transition
          "
        >
          <Plus size={16} />
          Create Webinar
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] p-0 bg-transparent border-none">
        {isComplete ? (
          <div className="bg-muted text-primary rounded-lg overflow-hidden">
            <DialogTitle className="sr-only">
              Webinar Created
            </DialogTitle>
            {/* SuccessStep */}
          </div>
        ) : (
          <>
            <DialogTitle className="sr-only">
              Create Webinar
            </DialogTitle>
            <MultiStepForm
              steps={steps}
              onComplete={handleComplete}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateWebinarButton;
