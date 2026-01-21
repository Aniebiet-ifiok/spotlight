// components/UserButtonWrapper.tsx
"use client"

import { UserButton } from "@clerk/nextjs"
import dynamic from "next/dynamic"

const DynamicUserButton = dynamic(() => Promise.resolve(UserButton), {
  ssr: false,
  // optional: loading: () => <div className="h-8 w-8 rounded-full bg-gray-200" />
})

export function UserButtonWrapper() {
  return <DynamicUserButton />
}