import { LayoutDashboard, Settings, Users, MonitorDot } from "lucide-react";

export const sidebar = {
  navMain: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Meus Clientes",
      href: "/dashboard/customers",
      icon: Users,
      roles: ["admin"],
    },
    {
      label: "Websites Templates",
      href: "/dashboard/products-web",
      icon: MonitorDot,
    },
    {
      label: "Configurações",
      href: "/dashboard/template-setup",
      icon: Settings,
    },
  ],
};
