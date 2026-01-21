import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useWebinarStore } from "@/store/useWebinarStore";
import { formatDate } from "date-fns";
import { CalendarIcon, Clock, Upload } from "lucide-react";
import { errorToJSON } from "next/dist/server/render";
import React from "react";
import { toast } from "sonner";

type Props = {
  // define props here if needed
  children?: React.ReactNode;
};

const BasicInfoStep = (props: Props) => {
  const { formData, updateBasicInfoField, getStepValidationErrors} = useWebinarStore()
  const {webinarName, description, date, time, timeFormat} = formData.basicInfo




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    const  {name, value } = e.target 
    updateBasicInfoField(name as keyof typeof formData.basicInfo, value)
  }

  const errors = getStepValidationErrors('basicInfo')

  const handleDateChange = (newDate: Date | undefined) =>{
   updateBasicInfoField('date', newDate)
   if(newDate){
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if(newDate < today){
      toast.error('Error: cannot select a date in the past')
      
    }
   }
  }



 const handleTimeFormatChange = (value: string) => {
    updateBasicInfoField('timeFormat', value as 'AM' | 'PM')
 }


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label
        htmlFor="webinarName"
        className={errors.webinarName ? 'text-red-400' : ''}
        ></Label>
        <Input 
        id="webinarName"
        name="webinarName"
        value={webinarName || ''}
        onChange={handleChange}
        placeholder="Introduction to Pluscode"
        className={cn(
          '!bg-background/50 border border-input',
          errors.webinarName && 'border-red-400 focus-visible:ring-red-600'

        )}
        />
        {errors.webinarName && (
            <p className="text-sm text-red-400">
              {errors.webinarName}
            </p>
          )}
      </div>

      <div className="space-y-2">
        <Label
        htmlFor="description"
        className={errors.description ? 'text-red-400' : ''}
        ></Label>
        <Textarea 
        id="description"
        name="description"
        value={description || ''}
        onChange={handleChange}
        placeholder="Tell Customers what your webinar is all about "
        className={cn(
          '!bg-background/50 border border-input',
          errors.description && 'border-red-400 focus-visible:ring-red-600'

        )}
        />
        {errors.description && (
            <p className="text-sm text-red-400">
              {errors.description}
            </p>
          )}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={errors.date ? 'text-red-400' : ''}>
            Webinar Date <span className="text-red-400">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
              variant="outline"
              className={cn(
                'w-full  justify-start text-left font-normal !bg-background/50 border border-input',
                !date && 'text-gray-500',
                errors.date && 'border-red-400 focus-visible:ring-red-400'
              )} >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? formatDate(date, 'PPP') : 'Select Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 !bg-background/50 border border-input ">
            <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            className="bg-background"
            disabled={(date)=>{
              const today = new Date()
              today.setHours(0,0,0,0) // reset time to start of the day 
              return date < today 
            }}></Calendar>
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-sm text-red-400">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label className={errors.time ? 'text-red-400' : ''}>
           Wwebinar Time <span className="text-red-400">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-foreground" />
                 
            <Input
        name="time"
        value={time || ''}
        onChange={handleChange}
        placeholder="12 : 00"
        className={cn(
          'pl-9 !bg=background/50 border border-input',
          errors.webinarName && 'border-red-400 focus-visible:ring-red-600'

        )}
            />
          </div>
          <Select
          value={timeFormat || 'AM'} 
        onValueChange={handleTimeFormatChange}>
            <SelectTrigger className="w-20 !bg-background/50 border border-input">
             <SelectValue placeholder="AM"/>
            </SelectTrigger>
            <SelectContent className="!bg-background/50 border border-input">
             <SelectItem value="AM">AM</SelectItem>
             <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
            </Select>
        </div>
          {errors.time && <p className="text-sm text-red-400">{errors.time}</p>}

      </div>
<div className="flex w-full items-center justify-between gap-2 text-sm text-gray-400 mt-4">
  <div className="flex items-center flex-1 whitespace-nowrap">
    <Upload className="w-4 h-4 mr-2 shrink-0" />
    Uploading a video makes this webinar pre-recorded
  </div>

  <Button
    variant="outline"
    className="relative border border-input hover:bg-background shrink-0 hover:cursor-pointer"
  >
    Upload File
    <Input
      type="file"
      className="absolute ml-4 inset-0 opacity-0 cursor-pointer"
    />
  </Button>
</div>

    </div>

    </div>

  );
};

export default BasicInfoStep;
