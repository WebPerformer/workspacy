"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
function AppHeader() {
  const { state, isMobile } = useSidebar();
  return (
    <div className="flex items-center justify-between h-[26px] mb-12 sm:mb-18">
      <div className="flex items-center justify-between gap-2">
        {isMobile ? (
          <SidebarTrigger />
        ) : state === "collapsed" ? (
          <SidebarTrigger />
        ) : null}
        <p>Dashboard</p>
      </div>
      <Button>Sign In</Button>
    </div>
  );
}

export default AppHeader;
