"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { Bell } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

function AppHeader() {
  const { state, isMobile } = useSidebar();
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-between h-[26px] mb-10 sm:mb-14">
      <div className="flex items-center justify-between gap-4">
        {isMobile ? (
          <SidebarTrigger />
        ) : state === "collapsed" ? (
          <SidebarTrigger />
        ) : null}
        {pathname === "/" ? (
          <p>Dashboard</p>
        ) : (
          pathname
            .replace("/", "")
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        )}
      </div>

      <Button variant="ghost" size="icon" className="text-accent">
        <Bell />
      </Button>
    </div>
  );
}

export default AppHeader;
