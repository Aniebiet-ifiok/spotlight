"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useWebinarStore } from "@/store/useWebinarStore";
import { AlertCircle, Check, ChevronRight, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { createWebinar } from "@/actions/webinar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Step = {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
};

type Props = {
  steps: Step[];
  onComplete: (id: string) => void;
};

const MultiStepForm: React.FC<Props> = ({ steps, onComplete }) => {
  const { validateStep, isSubmitting, setModalOpen, setSubmitting, formData } =
    useWebinarStore();
  const router = useRouter();

  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleBack = () => {
    if (isFirstStep) {
      setModalOpen(false);
    } else {
      setCurrentStepIndex(currentStepIndex - 1);
      setValidationError(null); // ✅ fixed typo: was setValidateError
    }
  };

  const handleNext = async () => {
    setValidationError(null);

    const isValid = validateStep(currentStep.id as keyof typeof formData);

    if (!isValid) {
      setValidationError("Please fill in all required fields");
      return;
    }

    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }

    if (isLastStep) {
      try {
        setSubmitting(true);
        const result = await createWebinar(formData);

        if (result.status === 200 && result.webinarId) {
          toast.success("Your Webinar Has Been Created Successfully");
          onComplete(result.webinarId);
        } else {
          toast.error(result.message || "Your Webinar has not been Created");
          setValidationError(result.message || "Failed to create webinar");
        }

        router.refresh();
      } catch (error) {
        console.error("Error creating webinar:", error);
        toast.error("Failed to create webinar. Please try again");
        setValidationError("Failed to create webinar. Please try again");
      } finally {
        setSubmitting(false);
      }
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  return (
 <div className="flex flex-col bg-[#27272A]/20 border border-border rounded-3xl overflow-hidden max-w-6xl mx-auto backdrop-blur-[106px] h-full">

  {/* Main Content: Sidebar + Step Content */}
  <div className="flex flex-1">
   {/* Sidebar */}
<div className="w-full md:w-1/3 p-6 space-y-6 relative">
  {steps.map((step, index) => {
    const isCompleted = completedSteps.includes(step.id);
    const isCurrent = index === currentStepIndex;
    const isPast = index < currentStepIndex;

    return (
      <div
        key={step.id}
        className="flex items-start gap-4 relative"
      >
        {/* Step Indicator */}
        <div className="relative flex flex-col items-center">
          <motion.div
            initial={false}
            animate={{
              backgroundColor:
                isCurrent || isCompleted
                  ? "rgb(147, 51, 234)"
                  : "rgb(31, 41, 55)",
            }}
            className="flex items-center justify-center size-8 rounded-full text-white font-semibold"
          >
            <motion.div
              animate={{ scale: isCurrent ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AnimatePresence mode="wait">
                {isCompleted ? (
                  <motion.div key="check">
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="number"
                    className="text-white/50"
                  >
                    {index + 1}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div className="w-0.5 h-16 bg-gray-700 overflow-hidden mt-1">
              <motion.div
                initial={{
                  height: isPast || isCompleted ? "100%" : "0%",
                }}
                animate={{
                  height: isPast || isCompleted ? "100%" : "0%",
                  backgroundColor: "rgb(147, 51, 234)",
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="pt-1">
          <motion.h3
            animate={{
              color:
                isCurrent || isCompleted
                  ? "rgb(255, 255, 255)"
                  : "rgb(156, 163, 175)",
            }}
            transition={{ duration: 0.3 }}
            className="font-medium"
          >
            {step.title}
          </motion.h3>
          <p className="text-sm text-gray-500">
            {step.description}
          </p>
        </div>
      </div>
    );
  })}
</div>


    <Separator
      orientation="vertical"
      className="data-[orientation=vertical]:h-1/2"
    />

    {/* Step Content */}
    <div className="w-full md:w-2/3 flex-1 flex flex-col p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{currentStep.title}</h2>
            <p className="text-gray-400">{currentStep.description}</p>
          </div>

          {/* Render current step component */}
          {currentStep.component}

          {/* Validation error */}
          {validationError && (
            <div className="flex mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md items-start gap-2 text-red-300">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>{validationError}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  </div>

  {/* Full-width Bottom Buttons: outside sidebar + content */}
  <div className="flex justify-between p-6 ">
    <Button
      variant="outline"
      onClick={handleBack}
      disabled={isSubmitting}
      className={cn(
        "border-gray-700 text-white hover:bg-gray-800",
        isFirstStep && "opacity-50 cursor-not-allowed"
      )}
    >
      {isFirstStep ? "Cancel" : "Back"}
    </Button>

    <Button onClick={handleNext} disabled={isSubmitting}>
      {isLastStep
        ? isSubmitting
          ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Creating...
            </>
          )
          : "Complete"
        : "Next"}
      {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
    </Button>
  </div>
</div>



  );
};

export default MultiStepForm;
