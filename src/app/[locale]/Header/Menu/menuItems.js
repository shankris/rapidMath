/* src/app/[locale]/Header/Menu/menuItems.js */

import { LayoutDashboard, Sigma, ChartNoAxesCombined } from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },

  {
    id: "practice",
    label: "Practice",
    href: "/practice",
    icon: Sigma,
  },

  {
    id: "reports",
    label: "Reports",
    href: "/reports",
    icon: ChartNoAxesCombined,
  },
];

export default menuItems;
