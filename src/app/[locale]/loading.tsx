"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-8">
      {/* Cinematic Logo Loader */}
      <div className="relative group">
        <motion.div 
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="text-6xl font-black italic tracking-tighter uppercase flex items-center gap-2"
        >
          <span className="text-primary text-glow-primary">KERO</span>
          <span className="text-foreground">TRADE</span>
        </motion.div>
        
        {/* Progress Orbit */}
        <div className="absolute inset-0 -m-8 border border-primary/10 rounded-full"></div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 -m-8 border-t-2 border-primary rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
        ></motion.div>
      </div>

      {/* Loading Text */}
      <div className="space-y-2 text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse"
        >
          Initializing Intelligence
        </motion.p>
        <div className="w-32 h-1 bg-surface rounded-full overflow-hidden mx-auto">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),1)]"
          ></motion.div>
        </div>
      </div>
    </div>
  );
}
