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
import { sidebar } from "@/src/data/sidebar";

// App context and logic
import { AuthContext } from "@/src/contexts/AuthContext";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const { user } = useContext(AuthContext);

  const filteredNav = sidebar.navMain.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

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
              <Button className="w-full">Entrar</Button>
            </Link>
          )}
        </SidebarGroup>
        {user && (
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
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
