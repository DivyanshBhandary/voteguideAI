"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FileText, AlertTriangle, ChevronDown } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Registration",
    description: "Submit Form 6 to enroll as a new voter.",
    documents: ["Aadhaar Card or PAN Card", "Recent Passport Size Photograph", "Address Proof (Utility bill, Rent agreement)"],
    mistakes: ["Submitting multiple forms", "Incorrect date of birth format", "Uploading blurry documents"],
  },
  {
    id: 2,
    title: "Verification",
    description: "BLO (Booth Level Officer) verifies your submitted documents.",
    documents: ["Original ID proofs ready for inspection"],
    mistakes: ["Not being available at the registered address", "Providing fake documents"],
  },
  {
    id: 3,
    title: "Polling",
    description: "Cast your vote at the designated polling booth.",
    documents: ["EPIC (Voter ID) Card", "Voter Information Slip"],
    mistakes: ["Carrying electronic devices to the booth", "Wearing political party merchandise"],
  },
  {
    id: 4,
    title: "Results",
    description: "Counting of votes and declaration of results.",
    documents: [],
    mistakes: ["Believing unverified social media rumors"],
  },
];

export function JourneyMap() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="relative py-8 pl-4 sm:pl-8">
      {/* Vertical Timeline Line */}
      <div className="absolute left-8 sm:left-12 top-12 bottom-12 w-0.5 bg-gradient-to-b from-orange-600/50 via-zinc-800 to-transparent" />

      <div className="space-y-8 relative">
        {steps.map((step) => {
          const isExpanded = expandedId === step.id;
          return (
            <div key={step.id} className="relative flex items-start group">
              {/* Timeline Dot */}
              <div className="absolute -left-[1.35rem] sm:-left-[1.35rem] mt-4 w-6 h-6 rounded-full bg-zinc-950 border-2 border-orange-600 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(234,88,12,0.3)]">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
              </div>

              {/* Card content */}
              <div className="ml-8 w-full max-w-2xl">
                <motion.div
                  layout
                  onClick={() => setExpandedId(isExpanded ? null : step.id)}
                  className="cursor-pointer bg-zinc-950/40 backdrop-blur-md border border-zinc-800/60 hover:border-orange-600/30 rounded-2xl p-5 shadow-lg transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-orange-500 text-sm font-semibold tracking-wider">STEP {step.id}</span>
                      <h3 className="text-xl font-bold text-zinc-100 mt-1">{step.title}</h3>
                      <p className="text-zinc-400 text-sm mt-1">{step.description}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 mt-6 border-t border-zinc-800/50 space-y-4">
                          {step.documents.length > 0 && (
                            <div>
                              <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-200 mb-2">
                                <FileText className="w-4 h-4 text-blue-400" /> Required Documents
                              </h4>
                              <ul className="space-y-1">
                                {step.documents.map((doc, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                                    <CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                                    <span>{doc}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {step.mistakes.length > 0 && (
                            <div>
                              <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-200 mb-2">
                                <AlertTriangle className="w-4 h-4 text-red-400" /> Common Mistakes
                              </h4>
                              <ul className="space-y-1">
                                {step.mistakes.map((mistake, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                                    <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                    </div>
                                    <span>{mistake}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
