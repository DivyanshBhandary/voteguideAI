"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";

const faqKnowledgeBase = [
  { question: "How do I register to vote?", answer: "You can register by filling out Form 6 online or offline.", href: "/eligibility" },
  { question: "What is an EVM?", answer: "Electronic Voting Machine used in Indian elections.", href: "/chat" },
  { question: "What does NOTA mean?", answer: "None Of The Above. It allows you to reject all candidates.", href: "/chat" },
  { question: "How to find my polling booth?", answer: "You can find your polling booth on the Election Commission website or using our locator.", href: "/locator" },
  { question: "Am I eligible to vote?", answer: "You must be 18+ and an Indian citizen.", href: "/eligibility" },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  const router = useRouter();

  // Handle Command+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const results = faqKnowledgeBase.filter((item) =>
    item.question.toLowerCase().includes(query.toLowerCase()) || 
    item.answer.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-md hover:text-zinc-200 hover:border-zinc-700 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search FAQs...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 font-mono text-[10px] font-medium text-zinc-500 bg-zinc-800 rounded">
          <Command className="w-3 h-3" /> K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center px-4 py-3 border-b border-zinc-800">
                <Search className="w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder={t("search.placeholder") as string}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none px-3 text-zinc-100 placeholder:text-zinc-500"
                />
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length > 0 ? (
                  results.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setIsOpen(false);
                        router.push(result.href);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-zinc-900 transition-colors group flex flex-col gap-1"
                    >
                      <span className="text-zinc-200 font-medium group-hover:text-orange-500 transition-colors">{result.question}</span>
                      <span className="text-zinc-500 text-sm line-clamp-1">{result.answer}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                    No results found for “{query}”
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
