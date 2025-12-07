"use client";

// React and Next.js hooks
import { useContext } from "react";
import { usePathname } from "next/navigation";

// Next.js components
import Image from "next/image";
import Link from "next/link";

// Third-party icons
import { Search } from "lucide-react";

// UI components and forms
import { Button } from "@/src/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarTrigger,
  useSidebar,
} from "@/src/components/ui/sidebar";
import { Skeleton } from "@/src/components/ui/skeleton";
import LoggedUser from "@/src/components/sidebar/logged-user";

// Static assets
import logo from "../../public/images/logo.svg";

// App data
import { sidebar } from "@/src/data/sidebar";

// App context and logic
import { AuthContext } from "@/src/contexts/AuthContext";

// Types
import { NavMainItem } from "@/src/types/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const { user, isLoading } = useContext(AuthContext);

  const filteredNav = (sidebar.navMain as NavMainItem[]).filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex items-center justify-between">
            <Link href="/dashboard" onClick={() => isMobile && toggleSidebar()}>
              <Image src={logo} alt="logo" width={112} height={20} />
            </Link>
            <div>
              <Button variant="ghost" size="icon">
                <Search />
              </Button>
              {isMobile && <SidebarTrigger />}
            </div>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {isLoading ? (
            <div className="flex items-center gap-2 p-1">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ) : user ? (
            <LoggedUser />
          ) : (
            <Link
              href="/dashboard/signin"
              onClick={() => isMobile && toggleSidebar()}
              className="w-full"
            >
              <Button className="w-full">Entrar</Button>
            </Link>
          )}
        </SidebarGroup>
        {isLoading ? (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {[1, 2, 3, 4].map((i) => (
                  <SidebarMenuSkeleton key={i} showIcon />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          user && (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNav.map((item) => (
                    <SidebarMenuButton
                      key={item.label}
                      variant={pathname === item.href ? "outline" : "default"}
                      asChild
                    >
                      <Link
                        href={item.href}
                        onClick={() => isMobile && toggleSidebar()}
                        className="relative"
                      >
                        <div
                          className={
                            pathname === item.href
                              ? "absolute left-0 w-[3px] h-5 bg-primary rounded-full"
                              : "hidden"
                          }
                        />
                        <item.icon />
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
