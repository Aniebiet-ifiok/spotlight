"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import { sidebarLinks } from "../../../lib/data";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { UserButton } from "@clerk/nextjs";
import { UserButtonWrapper } from "@/components/UserButtonWrapper";

type Props = {
  children?: React.ReactNode;
};

const Sidebar = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <aside
        className="
          w-16 sm:w-24 h-screen sticky top-0
          py-10 px-2 sm:px-4
          border-r border-border
          bg-background
          flex flex-col items-center justify-between
        "
      >
        {/* LOGO / TITLE */}
        <span className="text-primary font-semibold text-sm">
          Spotlight
        </span>

        {/* NAV LINKS */}
        <TooltipProvider delayDuration={100}>
          <nav className="flex flex-col gap-4 items-center mt-10">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.includes(item.link);

              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                   <Link
  href={item.link}
  className={`
    flex items-center justify-center
    w-10 h-10 rounded-lg
    transition-transform transition-colors duration-300 ease-out
    ${isActive
      ? "iconBackground"
      : "hover:shadow-lg hover:scale-125 text-muted-foreground"}
  `}
>
  <Icon className="w-5 h-5" />
</Link>

                  </TooltipTrigger>

                  <TooltipContent side="right" sideOffset={8}>
                    <span className="text-sm">{item.title}</span>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </TooltipProvider>

        {/* USER PROFILE */}
        <div className="mt-auto">
         <UserButtonWrapper />
        </div>
      </aside>

      {/* MAIN CONTENT (optional) */}
      {children}
    </div>
  );
};

export default Sidebar;
