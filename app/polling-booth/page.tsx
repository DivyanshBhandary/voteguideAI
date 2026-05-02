"use client";

import { FormEvent, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MapPin, Search, ShieldCheck, Sparkles } from "lucide-react";

type LatLng = {
  lat: number;
  lng: number;
};

const ECI_PORTAL_URL = "https://electoralsearch.eci.gov.in/pollingstation/polling-station";

export default function PollingBoothPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("India");
  const [eciModalOpen, setEciModalOpen] = useState(false);
  const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "CHANGE_ME";
  const defaultMapUrl = `https://www.google.com/maps/embed/v1/place?key=${mapApiKey}&q=India&zoom=4`;
  const [mapUrl, setMapUrl] = useState(defaultMapUrl);
  const [isSearching, setIsSearching] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Log API key availability to browser console
  if (typeof window !== 'undefined') {
    console.log('Map API Key Loaded:', !!mapApiKey);
    console.log('Map API Key Value:', mapApiKey);
  }

  const handleSearch = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
    const searchInput = inputElement?.value?.trim() || "";

    if (!searchInput) {
      setMapUrl(defaultMapUrl);
      setActiveQuery("");
      setSelectedLocation("India");
      return;
    }

    const newUrl = `https://www.google.com/maps/embed/v1/search?key=${mapApiKey}&q=${encodeURIComponent(`polling booths near ${searchInput}`)}+India&zoom=14`;

    console.log('Generated URL:', newUrl);
    console.log('Search Input:', searchInput);

    setMapUrl(newUrl);
    setActiveQuery(searchInput);
    setSelectedLocation(searchInput);
  };

  return (
    <main className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-600/10 px-4 py-2 text-sm text-orange-300">
          <MapPin className="h-4 w-4" />
          <span>Polling Booth Locator</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-zinc-100 sm:text-5xl">
            Interactive Polling Booth Locator
          </h1>
          <p className="max-w-2xl text-lg text-zinc-400 sm:text-xl">
            Search by PIN code or locality to center the live map, then verify your official booth using the Election Commission of India portal.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1.75fr_1.1fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="rounded-3xl border border-orange-500/10 bg-[#09090b]/95 p-6 shadow-[0_0_40px_rgba(251,146,60,0.18)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-orange-400/80">
                  Locate & verify
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
                  Center the map with your PIN or locality
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950/80 px-4 py-2 text-sm text-zinc-300 shadow-sm">
                <Sparkles className="h-4 w-4 text-orange-400" />
                Matte black mode enabled
              </div>
            </div>

            <form onSubmit={handleSearch} className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
              <label className="relative block w-full">
                <span className="sr-only">Search polling location</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Enter PIN code or locality..."
                  className="w-full rounded-2xl border border-zinc-800/70 bg-zinc-950/95 py-4 pl-12 pr-4 text-zinc-100 outline-none transition focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20"
                />
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 text-sm font-semibold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-orange-500/60"
                >
                  {isSearching ? (
                    <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                Center map
              </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveQuery("");
                    setSelectedLocation("India");
                    setMapUrl(defaultMapUrl);
                  }}
                  className="inline-flex min-w-[6rem] items-center justify-center rounded-2xl border border-zinc-800/70 bg-zinc-950/95 px-4 py-4 text-sm font-semibold text-zinc-200 transition hover:border-orange-500/70 hover:text-white"
                >
                  Clear
                </button>
              </div>
            </form>

            <div className="mt-4 rounded-3xl border border-orange-500/10 bg-black/60 px-5 py-4 text-sm text-zinc-300">
              <p>
                Current search center: <span className="font-semibold text-zinc-100">{selectedLocation}</span>
              </p>
              {locationError ? (
                <p className="mt-2 text-sm text-orange-300">{locationError}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-orange-500/20 bg-[#09090b] shadow-[0_0_40px_rgba(251,146,60,0.18)] border-orange-600/30 shadow-[0_0_20px_rgba(234,88,12,0.15)]">
            <div className="overflow-hidden rounded-xl border border-orange-500/20 bg-[#09090b]">
              <div className="border-b border-orange-500/10 bg-zinc-950/70 px-6 py-4">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-400/80">
                  Interactive Navigation
                </p>
              </div>

              <div className="relative h-[600px] bg-[#09090b] overflow-hidden">
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-[#09090b]/90 via-transparent to-[#09090b]/95" />
                <iframe
                  key={mapUrl}
                  ref={iframeRef}
                  title="Polling booth search map"
                  width="100%"
                  height="600"
                  loading="lazy"
                  allowFullScreen
                  className="rounded-xl"
                  src={mapUrl}
                  style={{ border: 0, borderRadius: 24, filter: "brightness(0.95) contrast(1.05)", pointerEvents: "auto" }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="rounded-3xl border border-orange-500/15 bg-zinc-950/95 p-6 shadow-xl shadow-orange-600/10">
            <div className="flex items-center gap-3 text-orange-400">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.25em] font-semibold">
                Verify Official Booth
              </span>
            </div>
            <div className="mt-5 space-y-4">
              <p className="text-zinc-400">
                Confirm your polling station directly with the Election Commission of India.
              </p>
              <button
                type="button"
                onClick={() => setEciModalOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 text-sm font-semibold text-zinc-950 transition hover:bg-orange-400"
              >
                Open ECI Portal
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-500/10 bg-[#09090b]/95 p-6 shadow-[0_0_30px_rgba(251,146,60,0.16)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-orange-300/80">
                  Step-by-Step Instructions
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-zinc-100">
                  Verify your polling booth safely
                </h3>
              </div>
            </div>

            <ol className="mt-6 space-y-4 text-sm text-zinc-400">
              <li className="rounded-3xl border border-orange-500/10 bg-zinc-950/80 p-4">
                <p className="font-semibold text-orange-300">Step 1</p>
                <p>Click the button above to open the official ECI Voters&apos; Services Portal.</p>
              </li>
              <li className="rounded-3xl border border-orange-500/10 bg-zinc-950/80 p-4">
                <p className="font-semibold text-orange-300">Step 2</p>
                <p>Enter your EPIC Number or search by your details to find your polling station name.</p>
              </li>
              <li className="rounded-3xl border border-orange-500/10 bg-zinc-950/80 p-4">
                <p className="font-semibold text-orange-300">Step 3</p>
                <p>Copy the official booth name back into our search field to center the map and get directions.</p>
              </li>
            </ol>
          </div>

          <div className="rounded-3xl border border-orange-500/10 bg-zinc-950/95 p-6 text-zinc-400 shadow-[0_0_30px_rgba(255,161,63,0.12)]">
            <h4 className="text-lg font-semibold text-zinc-100">Pro tip</h4>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              If you already know your booth name, search by locality or EPIC-linked address to see the exact location and nearby landmarks instantly.
            </p>
          </div>
        </motion.aside>
      </div>

      {eciModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-orange-500/20 bg-zinc-950 p-6 shadow-2xl shadow-orange-600/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-100">ECI Portal Access</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  The ECI portal may be blocked by CSP. Choose the web portal or use SMS fallback.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEciModalOpen(false)}
                className="rounded-full border border-zinc-700/80 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition hover:border-orange-500/40 hover:text-zinc-100"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <a
                href={ECI_PORTAL_URL}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl bg-orange-500 px-5 py-4 text-center text-sm font-semibold text-zinc-950 transition hover:bg-orange-400"
              >
                Option A: Open Web Portal
              </a>

              <div className="rounded-2xl border border-orange-500/15 bg-zinc-900 p-5">
                <p className="font-semibold text-orange-300">Option B: Search via SMS</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Text <span className="font-semibold text-zinc-100">ECI</span> to <span className="font-semibold text-zinc-100">1950</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
