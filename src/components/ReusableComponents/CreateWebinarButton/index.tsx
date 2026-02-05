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
import SuccessStep from "./SuccessStep";
import { toast } from "sonner";
import Stripe from "stripe";

type Props = {
  stripeProducts: Stripe.Product[] | [];
};

const CreateWebinarButton = ({ stripeProducts }: Props) => {
  const {
    isModalOpen,
    setModalOpen,
    isComplete,
    setComplete,
    resetForm,
    formData,
  } = useWebinarStore();

  const [webinarLink, setWebinarLink] = useState("");

  // Steps for the multi-step form
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
      component: <CTAStep stripeProducts={stripeProducts} />,
    },
    {
      id: "additionalInfo",
      title: "Additional Information",
      description: "Please fill information about additional options if necessary",
      component: <AdditionalInfoStep />,
    },
  ];

  // Handle creating webinar via Node.js + MongoDB
  const handleComplete = async () => {
    try {
      const { basicInfo, cta, additionalInfo } = formData;

      const form = new FormData();
      form.append("title", basicInfo.webinarName || "");
      form.append("description", basicInfo.description || "");
      form.append("startTime", basicInfo.date?.toISOString() || "");
      form.append("endTime", ""); // optional, can calculate from duration
      form.append("tags", JSON.stringify(cta.tags || []));
      form.append("ctaLabel", cta.ctaLabel || "");
      form.append("ctaType", cta.ctaType || "");
      form.append("ctaUrl", ""); // optional, add if you have URL field
      form.append("priceId", cta.priceId || "");
      form.append("couponEnabled", additionalInfo.couponEnabled?.toString() || "false");
      form.append("couponCode", additionalInfo.couponCode || "");
      form.append("lockChat", additionalInfo.lockChat?.toString() || "false");

      // Optional thumbnail upload
      if (basicInfo.thumbnail && typeof basicInfo.thumbnail !== "string") {
        form.append("thumbnail", basicInfo.thumbnail);
      }

      // Submit to your Node.js backend route
      const res = await fetch(`http://localhost:5000/webinars`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to create webinar");

      const data = await res.json();

      setComplete(true);
      setWebinarLink(`/live-webinar/${data._id}`);
      toast.success("Webinar created successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create webinar");
    }
  };

  const handleCreateNew = () => {
    resetForm();
    setComplete(false);
    setWebinarLink("");
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
            <DialogTitle className="sr-only">Webinar Created</DialogTitle>
            <SuccessStep
              webinarLink={webinarLink}
              onCreateNew={handleCreateNew}
            />
          </div>
        ) : (
          <>
            <DialogTitle className="sr-only">Create Webinar</DialogTitle>
            <MultiStepForm steps={steps} onComplete={handleComplete} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateWebinarButton;
