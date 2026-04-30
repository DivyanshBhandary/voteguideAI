"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Navigation, Clock, Users, AlertCircle } from "lucide-react";

type PollingBooth = {
  id: number;
  name: string;
  address: string;
  boothNumber: string;
  distance: string;
  voters: number;
  timing: string;
};

export default function LocatorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<PollingBooth[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setResults([
        {
          id: 1,
          name: "Government Senior Secondary School",
          address: "Sector 15, Rohini, Delhi - 110085",
          boothNumber: "123-ABC",
          distance: "2.3 km",
          voters: 1247,
          timing: "7:00 AM - 6:00 PM"
        },
        {
          id: 2,
          name: "Rohini Public School",
          address: "Sector 16, Rohini, Delhi - 110085",
          boothNumber: "124-DEF",
          distance: "3.1 km",
          voters: 1156,
          timing: "7:00 AM - 6:00 PM"
        }
      ]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 font-medium text-sm"
        >
          <MapPin className="w-4 h-4" />
          <span>Polling Booth Locator</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-zinc-100"
        >
          Find Your Polling Booth
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-zinc-400 max-w-2xl mx-auto"
        >
          Locate your designated polling station using your voter ID, address, or current location.
        </motion.p>
      </div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your voter ID, address, or pincode..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </motion.button>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-zinc-400">
            <button className="flex items-center gap-2 hover:text-orange-500 transition-colors">
              <Navigation className="w-4 h-4" />
              Use current location
            </button>
            <span className="text-zinc-600">|</span>
            <span>Or search by voter ID, address, or pincode</span>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-zinc-100">Nearby Polling Booths</h2>

            {results.map((booth, index) => (
              <motion.div
                key={booth.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-xl p-6 hover:border-orange-600/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-100 mb-1">{booth.name}</h3>
                    <p className="text-zinc-400 text-sm mb-2">{booth.address}</p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Booth: {booth.boothNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Navigation className="w-4 h-4" />
                        {booth.distance}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-500 font-semibold">{booth.distance}</div>
                    <div className="text-zinc-500 text-sm">away</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{booth.timing}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{booth.voters} voters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-orange-500 hover:text-orange-400 text-sm font-medium"
                    >
                      Get Directions
                      <Navigation className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Important Information</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>• Bring your EPIC (Voter ID Card) and Voter Information Slip to the polling booth</li>
              <li>• Polling stations are typically schools, government buildings, or community centers</li>
              <li>• Voting hours are from 7:00 AM to 6:00 PM on election day</li>
              <li>• You can only vote at your designated polling booth</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}