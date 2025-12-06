import { LayoutDashboard, Settings, Users, MonitorDot } from "lucide-react";

export const sidebar = {
  navMain: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: undefined,
    },
    {
      label: "Meus Clientes",
      href: "/dashboard/customers",
      icon: Users,
      roles: ["admin"],
    },
    {
      label: "Websites",
      href: "/dashboard/products-web",
      icon: MonitorDot,
      roles: undefined,
    },
    {
      label: "Configurações",
      href: "/dashboard/template-setup",
      icon: Settings,
      roles: undefined,
    },
  ],
};
