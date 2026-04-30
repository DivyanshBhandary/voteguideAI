"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JourneyMap } from "@/components/JourneyMap";
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormData = {
  age: string;
  citizenship: string;
  state: string;
};

export default function EligibilityPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: "",
    citizenship: "",
    state: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<"Eligible" | "Ineligible" | null>(null);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simple logic for eligibility
    const age = parseInt(formData.age);
    const isEligible = age >= 18 && formData.citizenship === "Yes" && formData.state.length > 0;
    
    const finalResult = isEligible ? "Eligible" : "Ineligible";
    setResult(finalResult);

    try {
      const { createBrowserSupabaseClient } = await import("@/lib/supabase");
      const supabaseClient = createBrowserSupabaseClient();
      const { data: { session } } = await supabaseClient.auth.getSession();

      await supabaseClient.from("eligibility_checks").insert([
        {
          user_id: session?.user.id ?? null,
          age: age || null,
          is_citizen: formData.citizenship === "Yes",
          state: formData.state,
          result: finalResult,
        },
      ]);
    } catch (error) {
      console.error("Error saving to Supabase", error);
    } finally {
      setIsSubmitting(false);
      setStep(4); // Move to results step
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* Eligibility Checker */}
      <section>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-100">Eligibility Checker</h1>
          <p className="text-zinc-400 mt-2">Find out if you are eligible to vote in the upcoming elections.</p>
        </div>

        <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden min-h-[300px] flex flex-col">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900">
            <motion.div 
              className="h-full bg-orange-600"
              initial={{ width: "25%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex-1 flex flex-col justify-center relative z-10 pt-4">
            <AnimatePresence mode="wait">
              {/* Step 1: Age */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold">How old are you?</h2>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Enter your age"
                    className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                  />
                  <div>
                    <button
                      onClick={handleNext}
                      disabled={!formData.age}
                      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Citizenship */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold">Are you an Indian citizen?</h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setFormData({ ...formData, citizenship: "Yes" })}
                      className={cn(
                        "flex-1 py-4 rounded-xl border transition-all font-medium",
                        formData.citizenship === "Yes" 
                          ? "bg-orange-600/10 border-orange-600 text-orange-500" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      )}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, citizenship: "No" })}
                      className={cn(
                        "flex-1 py-4 rounded-xl border transition-all font-medium",
                        formData.citizenship === "No" 
                          ? "bg-orange-600/10 border-orange-600 text-orange-500" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      )}
                    >
                      No
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-6 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!formData.citizenship}
                      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: State */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold">Which state do you reside in?</h2>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-600/50 appearance-none"
                  >
                    <option value="" disabled>Select your state</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="flex gap-4">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-6 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!formData.state || isSubmitting}
                      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check Eligibility"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Result */}
              {step === 4 && result && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center space-y-4 py-8"
                >
                  {result === "Eligible" ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h2 className="text-3xl font-bold text-zinc-100">You are Eligible!</h2>
                      <p className="text-zinc-400 max-w-md">
                        Great news! You meet the basic requirements to vote. Your next step is to ensure you are registered on the electoral roll.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                        <XCircle className="w-10 h-10" />
                      </div>
                      <h2 className="text-3xl font-bold text-zinc-100">Not Eligible Yet</h2>
                      <p className="text-zinc-400 max-w-md">
                        Based on your answers, you do not meet the current criteria to vote. You must be an Indian citizen and at least 18 years of age.
                      </p>
                    </>
                  )}
                  
                  <button
                    onClick={() => {
                      setStep(1);
                      setFormData({ age: "", citizenship: "", state: "" });
                      setResult(null);
                    }}
                    className="mt-8 text-orange-500 hover:text-orange-400 font-medium underline-offset-4 hover:underline"
                  >
                    Start Over
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Interactive Election Journey */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-100">Your Election Journey</h2>
          <p className="text-zinc-400 mt-2">Follow these steps to ensure a smooth voting experience.</p>
        </div>
        <JourneyMap />
      </section>
    </div>
  );
}
