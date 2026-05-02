"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CardSkeleton, NewsOverviewSkeleton, SnapshotSkeleton } from "@/components/SkeletonLoaders";

interface ElectionNews {
  title: string;
  description: string;
  percentage?: string;
  sourceUrl: string;
}

interface ElectionData {
  ongoing?: ElectionNews[];
  results?: ElectionNews[];
  turnout?: ElectionNews[];
  trending?: ElectionNews[];
}

export default function Home() {
  const { t } = useTranslation();
  const [electionData, setElectionData] = useState<ElectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const mockElectionData: ElectionData = {
    ongoing: [
      {
        title: "Phase 2 voting updates are live",
        description: "Polling continues across key districts with the latest ballot counts coming in every hour.",
        sourceUrl: "",
      },
    ],
    results: [
      {
        title: "Seat prediction trends remain tight",
        description: "Early tallies show a close contest in several high-profile constituencies.",
        percentage: "N/A",
        sourceUrl: "",
      },
    ],
    turnout: [
      {
        title: "Turnout remains steady",
        description: "Voter participation is being tracked as polling stations report their numbers.",
        percentage: "N/A",
        sourceUrl: "",
      },
    ],
    trending: [
      {
        title: "Regional election coverage keeps pace",
        description: "News providers are tracking the latest announcements and result forecasts.",
        sourceUrl: "",
      },
      {
        title: "Key constituency snapshots",
        description: "Focus remains on high-stakes districts that may decide the final outcome.",
        sourceUrl: "",
      },
    ],
  };

  const displayData = electionData ?? mockElectionData;
  const isPlaceholder = !isLoading && !electionData;

  useEffect(() => {
    const fetchElectionNews = async () => {
      try {
        const res = await fetch("/api/election-news");
        const json = await res.json();
        if (json.success && json.data) {
          setElectionData(json.data);
        } else {
          const message = json?.error || "Failed to load news";
          console.warn("Election news response error, falling back to mock data:", message);
          setFetchError(message);
          setElectionData(mockElectionData);
        }
      } catch (err) {
        console.warn("Failed to fetch election news, using mock fallback:", err);
        setFetchError("Unable to load election news.");
        setElectionData(mockElectionData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchElectionNews();
  }, []);

  const handleCardClick = (url: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden pt-12 pb-24 bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-white dark:bg-zinc-950" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-600/30 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 container max-w-5xl mx-auto px-6 flex flex-col items-center text-center space-y-8">
        
        {/* Hero Typography */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white max-w-4xl"
        >
          {t("hero.title") as string}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl"
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
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 60 }}
          className="w-full max-w-5xl mt-12"
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 p-6 shadow-2xl shadow-black/10">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-orange-400 font-semibold">Live Election Feed</div>
                  <h2 className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-white">Election updates in one view</h2>
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-full bg-zinc-100 px-4 py-2 text-xs uppercase text-zinc-700 tracking-[0.2em] dark:bg-zinc-900 dark:text-zinc-300"
                >
                  Real time
                </motion.div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {isLoading ? (
                  <>
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </>
                ) : fetchError ? (
                  <>
                    <div className="sm:col-span-3 rounded-3xl border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/40 p-6 text-left">
                      <p className="text-sm font-semibold text-orange-700 dark:text-orange-200">Live feed unavailable — using mock election data.</p>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Continue exploring the app while the server-side feed is being restored.</p>
                    </div>
                    <button
                      className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 p-5 text-left"
                      disabled
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Ongoing</p>
                      <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">{displayData.ongoing?.[0]?.title}</p>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{displayData.ongoing?.[0]?.description}</p>
                    </button>
                    <button
                      className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 p-5 text-left"
                      disabled
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Results</p>
                      <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">{displayData.results?.[0]?.title}</p>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{displayData.results?.[0]?.description}</p>
                    </button>
                    <button
                      className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 p-5 text-left"
                      disabled
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Turnout</p>
                      <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">{displayData.turnout?.[0]?.percentage || displayData.turnout?.[0]?.title}</p>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{displayData.turnout?.[0]?.description}</p>
                    </button>
                  </>
                ) : (
                  <>
                    {displayData?.ongoing?.[0] && (
                      <button
                        onClick={() => displayData.ongoing?.[0]?.sourceUrl && handleCardClick(displayData.ongoing[0].sourceUrl)}
                        className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 p-5 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Ongoing</p>
                        <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">{displayData.ongoing[0].title}</p>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{displayData.ongoing[0].description}</p>
                      </button>
                    )}
                    {displayData?.results?.[0] && (
                      <button
                        onClick={() => displayData.results?.[0]?.sourceUrl && handleCardClick(displayData.results[0].sourceUrl)}
                        className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 p-5 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Results</p>
                        <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">{displayData.results[0].title}</p>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{displayData.results[0].description}</p>
                      </button>
                    )}
                    {displayData?.turnout?.[0] && (
                      <button
                        onClick={() => displayData.turnout?.[0]?.sourceUrl && handleCardClick(displayData.turnout[0].sourceUrl)}
                        className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 p-5 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Turnout</p>
                        <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">{displayData.turnout[0].percentage || displayData.turnout[0].title}</p>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{displayData.turnout[0].description}</p>
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {isLoading ? (
                  <>
                    <CardSkeleton />
                    <CardSkeleton />
                  </>
                ) : (
                  <>
                    {displayData?.trending?.[0] && (
                      <button
                        onClick={() => displayData.trending?.[0]?.sourceUrl && handleCardClick(displayData.trending[0].sourceUrl)}
                        className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 p-5 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Trending</p>
                        <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">{displayData.trending[0].title}</p>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{displayData.trending[0].description}</p>
                      </button>
                    )}
                    {displayData?.trending?.[1] && (
                      <button
                        onClick={() => displayData.trending?.[1]?.sourceUrl && handleCardClick(displayData.trending[1].sourceUrl)}
                        className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 p-5 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Snapshot</p>
                        <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">{displayData.trending[1].title}</p>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{displayData.trending[1].description}</p>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 p-6 shadow-2xl shadow-black/10">
                {isLoading ? (
                  <NewsOverviewSkeleton />
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Overview</p>
                        <h3 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">{displayData?.trending?.[0]?.title || 'Ongoing Elections'}</h3>
                      </div>
                      <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-800 dark:text-emerald-200">Live</span>
                    </div>
                    <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {displayData?.trending?.[0]?.description || 'Multiple regional contests are active. Monitor the latest seat trends, voter turnout, and milestone updates in one streamlined view.'}
                    </p>
                  </>
                )}
              </div>

              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 p-6 shadow-2xl shadow-black/10">
                {isLoading ? (
                  <SnapshotSkeleton />
                ) : (
                  <div className="grid gap-4">
                    {[
                      displayData?.trending?.[1],
                      displayData?.results?.[0],
                      displayData?.results?.[1],
                      displayData?.ongoing?.[1]
                    ]
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => item?.sourceUrl && handleCardClick(item.sourceUrl)}
                          className="rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 p-4 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
                        >
                          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            {['Snapshot', 'Result', 'Result', 'Ongoing'][idx]}
                          </p>
                          <p className="mt-2 text-base font-semibold text-zinc-950 dark:text-white line-clamp-2">
                            {item?.title || (idx < 2 ? 'Loading...' : '')}
                          </p>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
