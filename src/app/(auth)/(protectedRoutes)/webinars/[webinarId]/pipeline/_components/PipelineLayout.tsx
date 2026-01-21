import UserInfoCard from "@/components/ReusableComponents/UserInfoCard"
import { Badge } from "@/components/ui/badge"
import { Attendee } from "@prisma/client"
import React from "react"

type Props = {
  title: string
  count: number
  users: Attendee[]
  tags: string[]
}

const PipelineLayout = ({ title, count, users, tags }: Props) => {
  return (
    <div className="flex-shrink-0 w-[350px] p-5 border border-border bg-background/10 rounded-xl backdrop-blur-2xl">
        <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium"> {title} </h2>
            <Badge variant="secondary"> {count}  </Badge> 
        </div>
        <div className="space-y-3 ooverflow-y-auto pr-2 scrollbar-hide max-h-[70v]">
            {users.map((user, index) => (
                <UserInfoCard
                key={index}
                customer={user}
                tags={tags}
                />
            ))}
        </div>
    </div>
  )
}

export default PipelineLayout
