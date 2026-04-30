"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  TrendingUp,
  Calendar,
  FileText,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface UserStats {
  eligibilityStatus: 'pending' | 'eligible' | 'ineligible';
  chatCount: number;
  registrationStatus: 'not_started' | 'in_progress' | 'completed';
  pollingBoothLocated: boolean;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats>({
    eligibilityStatus: 'pending',
    chatCount: 0,
    registrationStatus: 'not_started',
    pollingBoothLocated: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // Fetch eligibility check
        const { data: eligibilityData } = await supabase
          .from('eligibility_checks')
          .select('result')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        // Fetch chat count
        const { count: chatCount } = await supabase
          .from('chat_history')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);

        setStats({
          eligibilityStatus: eligibilityData?.[0]?.result === 'Eligible' ? 'eligible' :
                           eligibilityData?.[0]?.result === 'Ineligible' ? 'ineligible' : 'pending',
          chatCount: chatCount || 0,
          registrationStatus: 'not_started', // This would need more complex logic
          pollingBoothLocated: false // This would need location tracking
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [router]);

  const quickActions = [
    {
      title: "Check Eligibility",
      description: "Verify your voting rights",
      href: "/eligibility",
      icon: CheckCircle2,
      status: stats.eligibilityStatus === 'eligible' ? 'completed' : 'pending'
    },
    {
      title: "Find Polling Booth",
      description: "Locate your voting center",
      href: "/locator",
      icon: MapPin,
      status: stats.pollingBoothLocated ? 'completed' : 'pending'
    },
    {
      title: "Chat Assistant",
      description: "Get election help",
      href: "/chat",
      icon: MessageSquare,
      status: stats.chatCount > 0 ? 'active' : 'pending'
    },
    {
      title: "Registration",
      description: "Complete voter registration",
      href: "/eligibility",
      icon: FileText,
      status: stats.registrationStatus === 'completed' ? 'completed' : 'pending'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-orange-600/30 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-zinc-400">Track your election journey and stay informed</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Eligibility Status",
            value: stats.eligibilityStatus === 'eligible' ? "Eligible" :
                   stats.eligibilityStatus === 'ineligible' ? "Not Eligible" : "Not Checked",
            icon: CheckCircle2,
            color: stats.eligibilityStatus === 'eligible' ? "text-green-500" :
                   stats.eligibilityStatus === 'ineligible' ? "text-red-500" : "text-yellow-500"
          },
          {
            title: "Chat Sessions",
            value: stats.chatCount.toString(),
            icon: MessageSquare,
            color: "text-blue-500"
          },
          {
            title: "Registration",
            value: stats.registrationStatus === 'completed' ? "Complete" :
                   stats.registrationStatus === 'in_progress' ? "In Progress" : "Not Started",
            icon: FileText,
            color: stats.registrationStatus === 'completed' ? "text-green-500" : "text-yellow-500"
          },
          {
            title: "Polling Booth",
            value: stats.pollingBoothLocated ? "Located" : "Not Found",
            icon: MapPin,
            color: stats.pollingBoothLocated ? "text-green-500" : "text-yellow-500"
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <TrendingUp className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="text-2xl font-bold text-zinc-100 mb-1">{stat.value}</div>
              <div className="text-zinc-400 text-sm">{stat.title}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-100">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link href={action.href}>
                  <div className={`bg-zinc-950/60 backdrop-blur-md border rounded-xl p-6 hover:border-orange-600/30 transition-all cursor-pointer group ${
                    action.status === 'completed' ? 'border-green-600/30' :
                    action.status === 'active' ? 'border-blue-600/30' : 'border-zinc-800'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`w-6 h-6 ${
                        action.status === 'completed' ? 'text-green-500' :
                        action.status === 'active' ? 'text-blue-500' : 'text-zinc-400'
                      }`} />
                      {action.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2 group-hover:text-orange-500 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4">{action.description}</p>
                    <div className="flex items-center text-orange-500 text-sm font-medium">
                      {action.status === 'completed' ? 'View Details' : 'Get Started'}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Election Timeline */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-100">Election Timeline</h2>
        <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-xl p-6">
          <div className="space-y-6">
            {[
              {
                date: "December 2026",
                title: "Voter Registration Deadline",
                description: "Last date to register as a new voter",
                status: "upcoming"
              },
              {
                date: "January 2027",
                title: "Voter List Publication",
                description: "Final electoral roll will be published",
                status: "upcoming"
              },
              {
                date: "March 2027",
                title: "Election Notification",
                description: "Official election schedule announcement",
                status: "upcoming"
              },
              {
                date: "April-May 2027",
                title: "Election Period",
                description: "Voting will take place across all phases",
                status: "upcoming"
              }
            ].map((event, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-2" />
                  {index < 3 && <div className="w-0.5 h-12 bg-zinc-800 mt-2" />}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-500 font-medium text-sm">{event.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-1">{event.title}</h3>
                  <p className="text-zinc-400 text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-100">Recent Activity</h2>
        <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-xl p-6">
          <div className="space-y-4">
            {stats.chatCount > 0 ? (
              <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <div className="font-medium text-zinc-100">Chat with AI Assistant</div>
                  <div className="text-zinc-400 text-sm">{stats.chatCount} conversation{stats.chatCount > 1 ? 's' : ''}</div>
                </div>
                <Clock className="w-4 h-4 text-zinc-500" />
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">No Recent Activity</h3>
                <p className="text-zinc-400 mb-4">Start your election journey by checking eligibility or chatting with our AI assistant.</p>
                <Link href="/eligibility">
                  <button className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}