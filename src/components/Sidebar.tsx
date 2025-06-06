"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Box,
  Gift,
  Home,
  Layers,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Tag,
  Users,
  FileText,
  Archive,
  Tags
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Users",
    icon: Users,
    href: "/users",
    color: "text-violet-500",
  },
  {
    label: "Brands",
    icon: Archive,
    href: "/brands",
    color: "text-indigo-500",
  },
  {
    label: "Categories",
    icon: Layers,
    href: "/categories",
    color: "text-blue-500",
  },
  {
    label: "Tags",
    icon: Tags,
    href: "/tags",
    color: "text-teal-500",
  },
  {
    label: "Products",
    icon: Package,
    href: "/products",
    color: "text-pink-700",
  },
  {
    label: "Inventory",
    icon: Box,
    href: "/inventory",
    color: "text-emerald-500",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/orders",
    color: "text-orange-500",
  },
  {
    label: "Deals",
    icon: Tag,
    href: "/deals",
    color: "text-rose-500",
  },
  {
    label: "Reviews",
    icon: Star,
    href: "/reviews",
    color: "text-yellow-500",
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/reports",
    color: "text-green-500",
  },
  {
    label: "Logs",
    icon: FileText,
    href: "/logs",
    color: "text-red-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
];

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  className,
  isMobile = false,
  isCollapsed = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex h-full w-full flex-col overflow-y-auto border-r bg-background",
      isCollapsed ? "items-center" : "w-60 p-4",
      className
    )}>
      <div className={cn(
        "flex items-center",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <span className="text-xl font-bold">Admin Portal</span>
        )}
        {isMobile && !isCollapsed && (
          <button onClick={onClose} className="p-2">
            <span className="sr-only">Close sidebar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="mt-8 flex flex-1 flex-col gap-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={isMobile ? onClose : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              isCollapsed ? "justify-center" : ""
            )}
          >
            <route.icon className={cn("h-5 w-5", route.color)} />
            {!isCollapsed && <span>{route.label}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
} 