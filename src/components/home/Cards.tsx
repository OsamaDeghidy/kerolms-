"use client";

import { motion } from "framer-motion";
import React from "react";

export function StatCard({ label, val, icon, color }: { label: string, val: string, icon: any, color: string }) {
   return (
      <motion.div 
         whileHover={{ y: -10 }}
         className="bg-surface/20 p-10 rounded-[3rem] border border-surface text-center space-y-4 hover:border-primary/20 transition-all hover:shadow-2xl group"
      >
         <div className={`w-16 h-16 rounded-2xl bg-background border border-surface flex items-center justify-center mx-auto ${color} group-hover:scale-110 transition-transform`}>
            {icon}
         </div>
         <div className="space-y-1">
            <h4 className="text-2xl font-black italic tracking-tighter">{val}</h4>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted">{label}</p>
         </div>
      </motion.div>
   );
}

export function FeatureCard({ icon, title, description, isRtl }: { icon: React.ReactNode, title: string, description: string, isRtl: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-10 rounded-[3rem] bg-surface/30 backdrop-blur-xl border border-surface hover:border-primary/40 transition-all duration-500 flex flex-col items-start ${isRtl ? 'text-right' : 'text-left'} group hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden`}
    >
      <div className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} w-32 h-32 bg-primary/5 rounded-full blur-3xl ${isRtl ? '-ml-16' : '-mr-16'} -mt-16 group-hover:bg-primary/10 transition-colors`}></div>
      
      <div className={`w-20 h-20 rounded-[2rem] bg-background border border-surface flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-2xl relative z-10 text-primary ${isRtl ? 'mr-auto ml-0' : ''}`}>
        {icon}
      </div>
      <div className="relative z-10 space-y-4 w-full">
         <h3 className="text-2xl font-black italic tracking-tighter uppercase">{title}</h3>
         <p className="text-foreground-muted leading-relaxed font-medium italic">{description}</p>
      </div>
    </motion.div>
  );
}
