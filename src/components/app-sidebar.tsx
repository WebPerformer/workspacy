"use client";

// React and Next.js hooks
import { useContext } from "react";
import { usePathname } from "next/navigation";

// Next.js components
import Image from "next/image";
import Link from "next/link";

// Third-party icons
import { ChevronRight, ScanSearch, Search } from "lucide-react";

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
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/src/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import LoggedUser from "@/src/components/sidebar/logged-user";

// Static assets
import logo from "../../public/images/logo.svg";

// App data
import { projects } from "@/src/data/projects";
import { sidebar } from "@/src/data/sidebar";

// App context and logic
import { AuthContext } from "@/src/contexts/AuthContext";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const { user } = useContext(AuthContext);

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => isMobile && toggleSidebar()}>
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
          {user ? (
            <LoggedUser />
          ) : (
            <Link
              href="/signin"
              onClick={() => isMobile && toggleSidebar()}
              className="w-full"
            >
              <Button className="w-full">Sign In</Button>
            </Link>
          )}
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebar.navMain.map((item) => (
                <SidebarMenuButton
                  key={item.label}
                  variant={pathname === item.href ? "outline" : "default"}
                  asChild
                >
                  <Link
                    href={item.href}
                    onClick={() => isMobile && toggleSidebar()}
                  >
                    <item.icon />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            {projects.projectsMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.slice(0, 5).map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subItem.url}
                              onClick={() => isMobile && toggleSidebar()}
                            >
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href="/projects"
                            onClick={() => isMobile && toggleSidebar()}
                          >
                            <ScanSearch />
                            <span>Explore All</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
