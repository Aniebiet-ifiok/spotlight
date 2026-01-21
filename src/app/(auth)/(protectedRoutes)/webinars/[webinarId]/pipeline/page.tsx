import { getWebinarAttendance } from '@/actions/attendance'
import PageHeader from '@/components/ReusableComponents/PageHeader'
import { AttendedTypeEnum } from '@prisma/client'
import { Columns, HomeIcon, Layers, User } from 'lucide-react'
import React from 'react'
import { formatColumnTitle } from './_components/utils'
import PipelineLayout from './_components/PipelineLayout'

type Props = {
  params: {
    webinarId: string
  }
}


const Page = async ({ params }: Props) => {
  const { webinarId } = params
  const pipelineData = await getWebinarAttendance(webinarId)

  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<User className="w-4 h-4" />}
        mainIcon={<Layers className="w-4 h-4" />}
        rightIcon={<HomeIcon className="w-4 h-4" />}
        heading="Keep Track of all your Customers"
        placeholder="Search Name, Tag or Email"
      />

      {!pipelineData.data ? (
        <div className="h-[400px] flex items-center justify-center text-2xl text-muted-foreground">
          No pipelines found
        </div>
      ) : (
        <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6">
           

          {Object.entries(pipelineData.data).map(([columnType, columnData]) => (
            <PipelineLayout
              key={columnType}
              title={formatColumnTitle(columnType as AttendedTypeEnum)}
              count={columnData.count}
              users={columnData.users}
              tags={pipelineData.webinarTags}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Page