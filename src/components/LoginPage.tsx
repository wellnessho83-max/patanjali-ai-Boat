import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const OM_LOGO = "https://patanjaliwellness.com/assets/images/Patanjali-Wellness-logo.png"
export function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-stone-50 dark:bg-stone-950">
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-400 via-transparent to-transparent" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#f4f5ec] dark:bg-stone-900 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-stone-200 dark:border-stone-800 text-center">
          <div className="mb-6 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-[280px]"
            >
              <img 
                src={OM_LOGO} 
                alt="Patanjali Wellness" 
                className="w-full h-auto object-contain select-none max-h-24 hover:scale-105 transition-transform duration-300 pointer-events-none" 
              />
            </motion.div>
          </div>

          <h1 className="serif text-3xl font-bold text-[#d65636] mb-2">
            Patanjali Wellness
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-10 font-medium">
            Step into a Patanjali Wellness AI Assistant
          </p>

          <div className="space-y-4">
            <button 
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {loading ? 'Entering Wellness...' : 'Continue with Google'}
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl">
              <Sparkles className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-tight">Ayurvedic Wisdom</p>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl">
              <Heart className="w-5 h-5 text-red-500 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-tight">Root Cause Healing</p>
            </div>
          </div>

          <p className="mt-10 text-[10px] text-stone-400 dark:text-stone-500 font-medium uppercase tracking-[0.2em]">
            ॥ योगः चित्तवृत्तिनिरोधः ॥
          </p>
        </div>
      </motion.div>
    </div>
  );
}
