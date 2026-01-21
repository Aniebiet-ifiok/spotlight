import React from 'react'
import PageHeader from "@/components/ReusableComponents/PageHeader";
import { HomeIcon, Video, Users } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; 
import { Badge } from '@/components/ui/badge';
import { leadData } from './_tests_/data';

type Props = {}

const LeadPage = (props: Props) => {
  return (
    <div className="w-full flex flex-col gap-8">
       <PageHeader
        leftIcon={<HomeIcon className="w-3 h-3" />}
        mainIcon={<Video className="w-3 h-3" />}
        rightIcon={<Users className="w-3 h-3" />}
        heading="See All Your Leads Here "
        placeholder="Search option..."
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-sm text-muted-foreground'>
                Name
            </TableHead>
             <TableHead className='text-sm text-muted-foreground'>
                Email
            </TableHead>
             <TableHead className='text-sm text-muted-foreground'>
                Phone
            </TableHead>
             <TableHead className='text-sm text-right text-muted-foreground'>
                Tags
            </TableHead>
          
          </TableRow>
        </TableHeader>

        <TableBody>
          {leadData?.map((lead, idx) => (
            <TableRow
            key={idx}
            className="border-0"
            >
              <TableCell className="font-medium">
                {lead?.name}
              </TableCell>
              <TableCell >
                {lead?.email}
                </TableCell>
                 <TableCell >
                {lead?.phone}
                </TableCell>
                 <TableCell className="text-right">
                {lead?.tags?.map((tag, idx) => (
                  <Badge
                  key={idx}
                  variant="outline">
                    {tag}
                  </Badge>
                ))}
                </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </div>
  )
}

export default LeadPage
