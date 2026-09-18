import { LayoutDashboard, Sigma, ChartNoAxesCombined, UserCheck } from "lucide-react";

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
  {
    id: "review",
    label: "Review",
    href: "/review",
    icon: UserCheck,
  },
];

export default menuItems;
