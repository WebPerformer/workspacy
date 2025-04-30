"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
function AppHeader() {
  const { state } = useSidebar();
  return (
    <div className="flex items-center justify-between h-[26px]">
      <div className="flex items-center justify-between gap-2">
        {state === "collapsed" && <SidebarTrigger />}
        <p>Dashboard</p>
      </div>
      <Button>Sign In</Button>
    </div>
  );
}

export default AppHeader;
