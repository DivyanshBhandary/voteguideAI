"use client";

import { motion } from "framer-motion";
import { Menu, UserCircle, Bell, Globe } from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { useTranslation } from "@/hooks/useTranslation";

export function Navbar() {
  const { language, setLanguage } = useTranslation();

  return (
    <nav className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-2 hover:bg-zinc-900 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors"
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
          className="flex items-center gap-1 p-2 text-zinc-400 hover:text-zinc-100 transition-colors bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-md text-sm font-medium"
        >
          <Globe className="w-4 h-4" />
          {language === "en" ? "EN" : "HI"}
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 relative text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full" />
        </motion.button>
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 cursor-pointer hover:border-zinc-500 transition-colors"
        >
          <UserCircle className="w-5 h-5 text-zinc-400" />
        </motion.div>
      </div>
    </nav>
  );
}
