"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, CheckSquare, MessageSquare, MapPin, Settings } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Eligibility & Journey", href: "/eligibility", icon: CheckSquare },
  { name: "Q&A Assistant", href: "/chat", icon: MessageSquare },
  { name: "Polling Booth", href: "/locator", icon: MapPin },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 hidden md:block h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex flex-col h-full py-6 px-4">
        <div className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href} className="block relative">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-orange-600/10 rounded-lg border border-orange-600/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "text-orange-500" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                }`}>
                  <Icon className="w-5 h-5" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
