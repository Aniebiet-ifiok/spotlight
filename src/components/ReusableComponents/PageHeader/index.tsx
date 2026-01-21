import React from "react";
import Purpleicon from "../LayoutComponents/Purpleicon";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  heading?: string;
  mainIcon: React.ReactNode;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  children?: React.ReactNode;
  placeholder?: string;
};

const PageHeader = ({
  heading,
  mainIcon,
  leftIcon,
  rightIcon,
  children,
  placeholder,
}: Props) => {
  return (
    <div className="w-full flex flex-col gap-8 overflow-x-hidden">
      {/* Heading + Icons */}
      <div className="w-full flex justify-center sm:justify-between items-center gap-8 flex-wrap">
        <p className="text-primary text-4xl font-semibold">{heading}</p>

        <div className="relative md:mr-28 overflow-hidden">
          <Purpleicon className="absolute -left-4 -top-3 -z-10 -rotate-45 py-3">
            {leftIcon}
          </Purpleicon>
          <Purpleicon className="z-10 backdrop-blur">{mainIcon}</Purpleicon>
          <Purpleicon className="absolute -right-4 -top-3 -z-10 rotate-45 py-3">
            {rightIcon}
          </Purpleicon>
        </div>
      </div>

      {/* Search + Tabs */}
      <div className="w-full flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder={placeholder || "Search..."}
            className="pl-10 rounded-md w-full"
          />
        </div>

        {/* Tabs (scroll on mobile only) */}
        <div className="w-full md:w-auto overflow-x-auto md:overflow-visible">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
