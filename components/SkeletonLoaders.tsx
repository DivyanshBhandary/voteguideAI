"use client";

import { motion } from "framer-motion";

export function CardSkeleton() {
  return (
    <motion.div
      className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 p-5"
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="space-y-3">
        <div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
        <div className="h-6 w-32 bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
        <div className="h-4 w-full bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
        <div className="h-4 w-2/3 bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
      </div>
    </motion.div>
  );
}

export function NewsOverviewSkeleton() {
  return (
    <motion.div
      className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 p-6"
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="space-y-4">
        <div className="h-4 w-24 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
        <div className="h-6 w-40 bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
        <div className="h-4 w-full bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
        <div className="h-4 w-5/6 bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
      </div>
    </motion.div>
  );
}

export function SnapshotSkeleton() {
  return (
    <motion.div
      className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 p-6"
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 p-4 border border-zinc-200 dark:border-zinc-800 space-y-2"
          >
            <div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
            <div className="h-4 w-24 bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
