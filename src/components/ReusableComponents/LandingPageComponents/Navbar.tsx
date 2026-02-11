'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { navbarOptions } from '@/lib/data';
import { CgMenuRightAlt } from 'react-icons/cg'; // Switched to right for better thumb reach
import { IoClose } from 'react-icons/io5';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@prisma/client';
import { RiRobot3Line } from 'react-icons/ri';

type Props = {
  user?: User | null;
};

const Navbar = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (

      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 ${
        isScrolled ? 'bg-black/40 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex gap-2 items-center group">
            <div className="p-1.5 bg-[#2c8c88] rounded-lg group-hover:rotate-12 transition-all duration-300">
              <RiRobot3Line className="text-black text-lg" />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase italic tracking-widest">SalesPaddi</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black tracking-[0.2em] text-zinc-400">
            <Link href="#features" className="hover:text-[#2c8c88] transition-colors uppercase">Platform</Link>
            <Link href="#engine" className="hover:text-[#2c8c88] transition-colors uppercase">Intelligence</Link>
            <Link href={user ? "/home" : "/sign-in"}>
              <button className="px-6 py-2 rounded-full border border-[oklch(28.471%_0.06433_144.272)] bg-white/5 hover:border-[#2c8c88] transition-all text-white">
                {user ? 'DASHBOARD' : 'LOGIN'}
              </button>
            </Link>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;