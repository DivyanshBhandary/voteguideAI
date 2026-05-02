"use client";

import { motion } from "framer-motion";
import { Menu, UserCircle, Bell, Globe } from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

export function Navbar() {
  const { language, setLanguage } = useTranslation();

  return (
    <nav className="h-16 border-b bg-white/80 text-zinc-950 dark:bg-zinc-950/60 dark:text-zinc-50 border-zinc-200/70 dark:border-zinc-800 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-2 rounded-md text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          VoteGuide
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <GlobalSearch />

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className="flex items-center gap-1 p-2 text-zinc-700 hover:text-zinc-950 transition-colors bg-zinc-100/70 hover:bg-zinc-200 border border-zinc-200 rounded-md text-sm font-medium dark:text-zinc-300 dark:bg-zinc-900/50 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 dark:border-zinc-700"
        >
          <Globe className="w-4 h-4" />
          {language === "en" ? "EN" : "HI"}
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 relative text-zinc-600 hover:text-zinc-950 transition-colors dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full" />
        </motion.button>
        <Link href="/settings">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 cursor-pointer hover:border-zinc-400 transition-colors dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-500"
          >
            <UserCircle className="w-5 h-5 text-zinc-400" />
          </motion.div>
        </Link>
      </div>
    </nav>
  );
}
