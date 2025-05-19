"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Gamepad2,
  Database,
  User,
  ChevronFirst,
  Menu,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="size-5" />,
    href: "/dashboard",
  },
  {
    name: "Bingo Game",
    icon: <Gamepad2 className="size-5" />,
    href: "/bingo",
  },
  {
    name: "Game Data",
    icon: <Database className="size-5" />,
    href: "/games",
  },
  {
    name: "Profile",
    icon: <User className="size-5" />,
    href: "/profile",
  },
] as const;

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed h-screen z-30 bg-background border-r transition-all duration-300 ease-in-out border-gray-800 w-full bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4 border-gray-800 z-50">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold truncate">Bingo Admin</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="size-8"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="size-4" />
          ) : (
            <ChevronFirst className="size-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <li key={item.name}>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href} passHref>
                      <Button
                        asChild
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 h-11 relative",
                          isCollapsed && "justify-center px-0",
                          "hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors", // Hover effect
                          pathname === item.href
                            ? "bg-gray-200 dark:bg-gray-800 font-medium" // Active state
                            : ""
                        )}
                      >
                        <a>
                          {item.icon}
                          {!isCollapsed && (
                            <span className="truncate">{item.name}</span>
                          )}
                          {/* Active indicator bar */}
                          {pathname === item.href && (
                            <span className="absolute left-0 top-0 bottom-0 w-1 bg-gray-500 dark:bg-emerald-500 rounded-r-md"></span>
                          )}
                        </a>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent
                      side="right"
                      className="ml-2 bg-gray-300 dark:bg-emerald-500"
                    >
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
