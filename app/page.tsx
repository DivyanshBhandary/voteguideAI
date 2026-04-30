"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden pt-12 pb-24">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-600/30 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 container max-w-5xl mx-auto px-6 flex flex-col items-center text-center space-y-8">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 font-medium text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Award-Winning Election Assistant</span>
        </motion.div>

        {/* Hero Typography */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl"
        >
          {t("hero.title") as string}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl"
        >
          {t("hero.subtitle") as string}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/eligibility">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg shadow-[0_0_40px_rgba(234,88,12,0.4)] hover:shadow-[0_0_60px_rgba(234,88,12,0.6)] transition-all"
            >
              {t("hero.cta") as string}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Floating 3D Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 50 }}
          className="w-full max-w-5xl mt-16 perspective-[2000px]"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-full aspect-video rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col transform-style-3d shadow-orange-900/20"
          >
            {/* Mockup Header */}
            <div className="h-12 border-b border-zinc-800 flex items-center px-4 gap-2 bg-zinc-900/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {/* Mockup Body */}
            <div className="flex-1 flex p-6 gap-6">
              <div className="w-64 border border-zinc-800 rounded-xl bg-zinc-900/50 p-4 space-y-4">
                <div className="w-full h-8 rounded bg-zinc-800/80" />
                <div className="w-3/4 h-8 rounded bg-zinc-800/50" />
                <div className="w-5/6 h-8 rounded bg-zinc-800/50" />
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="w-1/3 h-10 rounded-lg bg-zinc-800/80" />
                <div className="flex gap-4">
                  <div className="flex-1 h-32 rounded-xl bg-orange-600/20 border border-orange-600/30" />
                  <div className="flex-1 h-32 rounded-xl bg-zinc-900/50 border border-zinc-800" />
                  <div className="flex-1 h-32 rounded-xl bg-zinc-900/50 border border-zinc-800" />
                </div>
                <div className="flex-1 rounded-xl bg-zinc-900/50 border border-zinc-800" />
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
