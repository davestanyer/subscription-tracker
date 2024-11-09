"use client";

import { MoonIcon, SunIcon, LayoutDashboard, Settings, Users } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const { setTheme, theme } = useTheme();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            SubManager
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-sm">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/clients" className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              Clients
            </Link>
            <Link href="/settings" className="flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </nav>
  );
}