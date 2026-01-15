"use client"

import React, {useState} from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useWebinarStore } from "@/store/eWebinarStore"
import MultiStepForm from "./MultiStepForm"
import BasicInfoStep from "./BasicInfoStep"

type Props = {}

const CreateWebinarButton: React.FC<Props> = () => {
  const { isModalOpen, setModalOpen,  isComplete, setComplete, isSubmitting, setSubmitting } = useWebinarStore()
  const [webinarLink, setWebinarLink] = useState('')
  const steps = [
   {
     id: 'basicInfo',
    title: 'Basic Information',
    description: 'Please fill out the standard info needed for your webinar',
    component: <BasicInfoStep/>
   },
  ]

  const handleComplete = (webinarId: string) => {
  setComplete(true)
  setWebinarLink(
    `${process.env.Next_PUBLICBASE_URL}/live-webinar/${webinarId}`
  )
  }




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
            hover:cursor-pointer
            transition
          "
        >
          <Plus size={16} />
          Create Webinar
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] p-0 bg-transparent border-none ">
     
           {isComplete ? (
             <div className="bg-muted text-primary rounded-lg overflow-hidden">
                <DialogTitle className="sr-only"> Webinar Created </DialogTitle>
                {/* SuccessStep */}
             </div>   
    ) : (
       <>
       <DialogTitle className="sr-only">Create Webinar </DialogTitle>
       <MultiStepForm
       steps={steps}
       onComplete={handleComplete} />
       </>  
    )}
       

        {/* Webinar form goes here */}
      </DialogContent>
    </Dialog>
  )
}

export default CreateWebinarButton
