"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Globe, Shield, Moon, Sun, Save } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { language, setLanguage } = useTranslation();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      // Could save to Supabase here
    }, 1000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 font-medium text-sm"
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Settings</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-zinc-100"
        >
          Account Settings
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-zinc-400"
        >
          Customize your VoteGuide experience
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Language Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-zinc-100">Language</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div>
                  <div className="font-medium text-zinc-100">English</div>
                  <div className="text-sm text-zinc-400">Default language</div>
                </div>
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={language === 'en'}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                  className="w-4 h-4 text-orange-600 bg-zinc-900 border-zinc-800 focus:ring-orange-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div>
                  <div className="font-medium text-zinc-100">हिंदी</div>
                  <div className="text-sm text-zinc-400">Hindi language support</div>
                </div>
                <input
                  type="radio"
                  name="language"
                  value="hi"
                  checked={language === 'hi'}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                  className="w-4 h-4 text-orange-600 bg-zinc-900 border-zinc-800 focus:ring-orange-600"
                />
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-zinc-100">Notifications</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Receive updates about election news and reminders' },
                { key: 'push', label: 'Push Notifications', description: 'Get instant notifications on your device' },
                { key: 'sms', label: 'SMS Notifications', description: 'Receive important alerts via text message' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zinc-100">{item.label}</div>
                    <div className="text-sm text-zinc-400">{item.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        [item.key]: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Moon className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-zinc-100">Appearance</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'light', label: 'Light', icon: Sun },
                { key: 'dark', label: 'Dark', icon: Moon },
                { key: 'system', label: 'System', icon: SettingsIcon }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setTheme(item.key as typeof theme)}
                    className={`p-4 rounded-lg border transition-all ${
                      theme === item.key
                        ? 'bg-orange-600/10 border-orange-600 text-orange-500'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{item.label}</div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-zinc-100">Account</h2>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-zinc-400" />
                </div>
                <div className="font-medium text-zinc-100">User</div>
                <div className="text-sm text-zinc-400">user@example.com</div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 rounded-lg transition-colors text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-zinc-100">Privacy</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="font-medium text-zinc-100">Data & Privacy</div>
                <div className="text-sm text-zinc-400">Manage your data and privacy settings</div>
              </button>

              <button className="w-full text-left p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="font-medium text-zinc-100">Security</div>
                <div className="text-sm text-zinc-400">Password and security options</div>
              </button>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-all"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}