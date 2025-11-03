"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { Bell } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { SidebarTrigger } from "@/src/components/ui/sidebar";
import { useSidebar } from "@/src/components/ui/sidebar";
import { Button } from "@/src/components/ui/button";

function AppHeader() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-between h-[20px] mt-2 mb-10 sm:mb-14">
      <div className="flex items-center justify-between gap-4">
        {isMobile && <SidebarTrigger />}
        {pathname === "/" ? (
          <p>Dashboard</p>
        ) : (
          <Breadcrumb>
            <BreadcrumbList>
              {pathname
                .split("/")
                .filter(Boolean)
                .map((segment, index, array) => (
                  <React.Fragment key={segment}>
                    <BreadcrumbItem>
                      {index === array.length - 1 ? (
                        <BreadcrumbPage>
                          {segment
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={`/${array.slice(0, index + 1).join("/")}`}
                        >
                          {segment
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < array.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      <Button variant="outline" size="icon" className="text-muted-foreground">
        <Bell />
      </Button>
    </div>
  );
}

export default AppHeader;
