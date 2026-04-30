"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for ShadCN-like class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// ShadCN ScrollArea Component built with Radix UI
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-zinc-800" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

// Types
type Message = {
  id: string;
  role: "user" | "model";
  content: string;
};

const quickActions = [
  "Check my Eligibility",
  "How to Register?",
  "Find Polling Booth",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading initially for fetch
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  // Fetch chat history from Supabase
  useEffect(() => {
    async function fetchHistory() {
      try {
        const { createBrowserSupabaseClient } = await import("@/lib/supabase");
        const supabase = createBrowserSupabaseClient();
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from("chat_history")
          .select("id, role, content")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setMessages(data as Message[]);
        } else {
          // Default welcome message
          setMessages([
            {
              id: "welcome",
              role: "model",
              content: "Hello! I am the VoteGuide AI Expert. I can assist you with your 2026 election eligibility, Form 6 registration steps, or help you understand voting concepts like EVM and NOTA. How can I help you today?",
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching chat history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollViewportRef.current) {
      const viewport = scrollViewportRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const modelMessageId = (Date.now() + 1).toString();
    
    // Add empty model message for streaming
    setMessages((prev) => [
      ...prev,
      { id: modelMessageId, role: "model", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
           window.location.href = "/login";
           return;
        }
        throw new Error("Failed to fetch");
      }
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let textContent = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          textContent += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === modelMessageId ? { ...msg, content: textContent } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMessageId
            ? { ...msg, content: "Sorry, I encountered an error. Please try again." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-50 max-w-4xl mx-auto w-full border-x border-zinc-900">
      <ScrollArea ref={scrollViewportRef} className="flex-1 p-4 md:p-6">
        <div className="flex flex-col gap-6 pb-24">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                    message.role === "user"
                      ? "bg-orange-600 text-white"
                      : "bg-zinc-800 border border-zinc-700 text-orange-500"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>

                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl",
                    message.role === "user"
                      ? "bg-orange-600/10 border border-orange-600/20 text-orange-50 rounded-tr-sm"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm"
                  )}
                >
                  {message.content ? (
                    <div
                      className={cn(
                        "prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800",
                        message.role === "user" && "prose-p:text-orange-50"
                      )}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 h-6">
                      <span className="w-2 h-2 bg-orange-500/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-orange-500/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-orange-500/50 rounded-full animate-bounce"></span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 p-4 pt-0">
        <div className="relative">
          {/* Quick Actions Row */}
          <div className="absolute -top-12 left-0 w-full flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                disabled={isLoading}
                className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-orange-600/10 hover:text-orange-500 hover:border-orange-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-orange-600/50 disabled:opacity-50"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="relative bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-xl overflow-hidden focus-within:ring-1 focus-within:ring-orange-600/50 focus-within:border-orange-600/50 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Ask me anything about the elections..."
              className="w-full max-h-32 min-h-[56px] py-4 pl-4 pr-12 bg-transparent resize-none focus:outline-none text-zinc-100 placeholder:text-zinc-500 scrollbar-hide"
              rows={1}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 rounded-xl bg-orange-600 text-white hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
