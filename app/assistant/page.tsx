"use client";

import { motion } from "framer-motion";
import { MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AssistantPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 font-medium text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Assistant</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-zinc-100"
        >
          Election Q&A Assistant
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-zinc-400 max-w-2xl mx-auto"
        >
          Get instant answers to your election-related questions. Our AI expert is here to help with eligibility, registration, voting procedures, and more.
        </motion.p>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {[
          {
            title: "Check Eligibility",
            description: "Verify if you meet voting requirements",
            href: "/eligibility"
          },
          {
            title: "Registration Help",
            description: "Step-by-step Form 6 guidance",
            href: "/chat"
          },
          {
            title: "Find Polling Booth",
            description: "Locate your voting center",
            href: "/locator"
          }
        ].map((action, index) => (
          <Link key={index} href={action.href}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-xl p-6 hover:border-orange-600/30 transition-all cursor-pointer group"
            >
              <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-orange-500 transition-colors mb-2">
                {action.title}
              </h3>
              <p className="text-zinc-400 text-sm mb-4">{action.description}</p>
              <div className="flex items-center text-orange-500 text-sm font-medium">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Start Chat CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Link href="/chat">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg shadow-[0_0_40px_rgba(234,88,12,0.4)] hover:shadow-[0_0_60px_rgba(234,88,12,0.6)] transition-all"
          >
            <MessageSquare className="w-6 h-6" />
            Start Conversation
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>

      {/* FAQ Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">Common Questions</h2>
        <div className="space-y-4">
          {[
            "What is an EVM and how does it work?",
            "What does NOTA mean in elections?",
            "How do I update my voter information?",
            "What documents do I need for registration?"
          ].map((question, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
              <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
              <span className="text-zinc-300">{question}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}