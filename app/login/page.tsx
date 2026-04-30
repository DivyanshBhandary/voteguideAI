"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-zinc-950 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-950/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-zinc-400 mt-2">Sign in to securely track your election journey.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Sign Up")}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
