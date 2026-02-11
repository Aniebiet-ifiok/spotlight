'use client';

import React from 'react';
import { User } from '@prisma/client';
import { motion } from 'framer-motion';
import { 
  Mic, ArrowRight, Sparkles, MessageSquare, 
  Video, Mail, Check, Shield, Cpu, Activity
} from 'lucide-react';
import Link from 'next/link';
import { RiRobot3Line } from 'react-icons/ri';

type Props = { user?: User | null };

const LandingHome = ({ user }: Props) => {
  return (
    <div className="relative min-h-screen w-full bg-[#050806] text-white overflow-hidden selection:bg-[#2c8c88]/40 font-sans">
      
      {/* 1. BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[oklch(28.471%_0.06433_144.272)]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[oklch(35.682%_0.08138_144.535)]/15 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <main className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-[1400px] mx-auto px-6 py-20 lg:py-0 min-h-screen gap-12">
        
        {/* LEFT: TEXT CONTENT */}
        <div className="w-full lg:w-5/12 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(28.471%_0.06433_144.272)]/30 border border-[oklch(35.682%_0.08138_144.535)]"
          >
            <Sparkles size={12} className="text-[#4ade80]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2c8c88]">AI-Powered Marketing OS</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl xl:text-8xl font-black tracking-tighter leading-none"
          >
            Sales that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2c8c88] to-[#4ade80]">
              Scale Themselves.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 max-w-md leading-relaxed"
          >
            A unified intelligence platform. Deploy AI agents across Video, Chat, and Email to close deals at light speed.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4">
            <Link href="/sign-up">
              <button className="px-8 py-4 bg-[#2c8c88] hover:bg-[#3db2ad] text-black font-black rounded-xl flex items-center gap-3 shadow-[0_15px_30px_rgba(44,140,136,0.2)] transition-all active:scale-95">
                START FREE TRIAL <ArrowRight size={20} />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT: THE CONSOLIDATED GRID (EVERYTHING AT ONCE) */}
        <div className="w-full lg:w-7/12 grid grid-cols-2 grid-rows-2 gap-4 h-[600px] relative">
          
          {/* A. VIDEO AGENT (Large Square) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-1 row-span-2 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl p-6 flex flex-col items-center justify-between relative overflow-hidden group"
          >
            <div className="w-full flex justify-between items-center text-[10px] font-bold text-zinc-500">
              <span className="flex items-center gap-1.5"><Video size={12} className="text-red-500" /> LIVE WEBINAR</span>
              <span className="text-[#4ade80]">428 VIEWERS</span>
            </div>
            
            <div className="relative py-12">
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute inset-0 bg-[#2c8c88]/10 blur-3xl rounded-full" />
              <div className="relative w-32 h-32 rounded-full border-2 border-[#2c8c88] flex items-center justify-center bg-zinc-900 shadow-[0_0_30px_rgba(44,140,136,0.2)]">
                <RiRobot3Line className="text-5xl text-[#2c8c88]" />
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 2 }} className="h-full w-1/2 bg-[#2c8c88]" />
              </div>
              <p className="text-[10px] text-center font-mono text-zinc-400">SYNCING VOICE LIPS ... 99%</p>
            </div>
          </motion.div>

          {/* B. NEURAL CHAT (Top Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 row-span-1 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl p-5 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <MessageSquare size={14} className="text-[#2c8c88]" />
              <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-zinc-800/50 rounded-lg text-[9px] text-zinc-300 w-3/4">How does the ROI look?</div>
              <div className="p-2 bg-[#2c8c88] rounded-lg text-[9px] text-black font-bold self-end ml-auto w-4/5">Based on your scale, we project 40% growth.</div>
            </div>
          </motion.div>

          {/* C. EMAIL AUTOMATION (Bottom Right) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1 row-span-1 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl p-5 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase">
              <Mail size={14} /> Neural Draft
            </div>
            <div className="space-y-2 py-2">
              <div className="h-2 w-full bg-zinc-800 rounded-full" />
              <div className="h-2 w-5/6 bg-zinc-800 rounded-full" />
              <div className="h-2 w-4/6 bg-zinc-800 rounded-full" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-[#4ade80]">READY TO SEND</span>
              <Check size={14} className="text-[#4ade80]" />
            </div>
          </motion.div>

          {/* D. FLOATING HUD DATA (Optional Overlays) */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -right-8 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-[#2c8c88] text-black font-black flex flex-col items-center gap-1 shadow-2xl z-20"
          >
            <Activity size={16} />
            <span className="text-[10px]">98%</span>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LandingHome;