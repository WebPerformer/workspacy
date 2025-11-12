import { LayoutDashboard, Settings, Users, MonitorDot } from "lucide-react";

export const sidebar = {
  navMain: [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Meus Clientes",
      href: "/customers",
      icon: Users,
      roles: ["admin"],
    },
    {
      label: "Websites Templates",
      href: "/products-web",
      icon: MonitorDot,
    },
    {
      label: "Configurações",
      href: "/template-setup",
      icon: Settings,
    },
  ],
};
