'use client'

import { CheckCircle } from "lucide-react"
import { OnBoardingSteps } from '../../../../../lib/data'
import Link from "next/link"
import React from 'react'

const OnBoarding = () => {
  return (
    <div className="flex flex-col gap-1 items-start justify-start">
      {OnBoardingSteps.map((step, index) => {
        return (
          <Link 
            key={index}
            href={step.link}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 " />
            <p className="text-base text-foreground">{step.title}</p>
          </Link>
        )
      })}
    </div>
  )
}

export default OnBoarding
