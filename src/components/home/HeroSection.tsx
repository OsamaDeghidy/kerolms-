"use client";

import { motion } from "framer-motion";
import { Activity, ArrowLeft, ArrowRight, PlayCircle, Star, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";

const TradingViewWidget = dynamic(() => import("@/components/TradingViewWidget"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface/20 animate-pulse rounded-2xl" />
});

export default function HeroSection({ isRtl, signals, locale }: { isRtl: boolean, signals: any[], locale: string }) {
  const t = useTranslations('HomePage');
  const [activeSymbol, setActiveSymbol] = useState("TVC:GOLD");

  const symbols = useMemo(() => [
    { id: "TVC:GOLD", name: isRtl ? "ذهب" : "Gold", icon: "💎" },
    { id: "FX:EURUSD", name: isRtl ? "يورو" : "Euro", icon: "€" },
    { id: "TVC:USOIL", name: isRtl ? "نفط" : "Oil", icon: "🛢️" },
  ], [isRtl]);

  return (
    <section className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center min-h-[90vh] relative z-10 pt-32 lg:pt-0">
      <div className="space-y-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface/50 backdrop-blur-md border border-surface text-primary text-xs font-black uppercase tracking-[0.2em] shadow-xl ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <Activity size={14} className="animate-pulse" />
          <span>{t('badge')}</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h1 className="text-3xl lg:text-5xl font-black italic tracking-tighter leading-[1.1] uppercase">
            {t.rich('hero_title', {
              span: (chunks: any) => <span className="text-primary text-glow-primary">{chunks}</span>
            })}
          </h1>
          <p className={`text-foreground-muted text-base lg:text-lg max-w-xl leading-relaxed italic font-medium border-primary/30 pl-6 ${isRtl ? 'border-r-4 pr-6 pl-0 text-right' : 'border-l-4 text-left'}`}>
            {t('hero_subtitle')}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-6"
        >
          <Link 
            href="/courses" 
            className="group relative px-8 py-4 rounded-[1.5rem] bg-primary text-background font-black transition-all flex items-center gap-4 text-lg shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <span className="relative z-10">{t('courses_button')}</span>
            <div className="relative z-10 w-8 h-8 rounded-full bg-background/20 flex items-center justify-center group-hover:translate-x-2 transition-transform">
               {isRtl ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </div>
          </Link>
          
          <Link 
            href="#what-we-do" 
            className={`px-8 py-4 rounded-[1.5rem] border border-surface bg-surface/20 backdrop-blur-xl hover:bg-surface transition-all flex items-center gap-3 font-black text-base group ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
               <PlayCircle size={24} className="text-primary" />
            </div>
            {t('watch_tutorial')}
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-10 flex flex-col sm:flex-row items-center gap-10 border-t border-surface/50"
        >
          <div className="flex -space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-14 h-14 rounded-full border-4 border-background overflow-hidden relative bg-surface shadow-2xl">
                 <Image 
                   src={`https://i.pravatar.cc/150?u=${i}`} 
                   alt="user" 
                   width={56} 
                   height={56} 
                   className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all cursor-pointer" 
                 />
              </div>
            ))}
          </div>
          <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-1 text-primary ${isRtl ? 'flex-row-reverse' : ''}`}>
              {[1,2,3,4,5].map((i) => <Star key={i} size={18} className="fill-current" />)}
              <span className={`${isRtl ? 'mr-2' : 'ml-2'} text-foreground font-black text-xl`}>5.0</span>
            </div>
            <div className="text-sm text-foreground-muted font-bold italic">
               {t.rich('trust_rich', {
                 span: (chunks: any) => <span className="text-foreground font-black text-glow-primary tracking-tighter">{chunks}</span>
               })}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Main Visual: Interactive Terminal */}
      <div className="relative group perspective-1000">
         <motion.div 
           initial={{ opacity: 0, rotateY: 20, rotateX: 10 }}
           animate={{ opacity: 1, rotateY: 0, rotateX: 0 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="relative z-10 w-full aspect-[4/5] lg:aspect-square bg-surface/30 backdrop-blur-2xl rounded-[4rem] border border-surface p-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
         >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            <div className="w-full h-full flex flex-col">
               <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5 relative z-20">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <TrendingUp size={20} />
                     </div>
                     <div>
                        <h4 className="text-lg font-black tracking-tighter italic uppercase">{symbols.find(s => s.id === activeSymbol)?.name} LIVE</h4>
                        <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {isRtl ? "بيانات حقيقية / نظام اسمي" : "SYSTEM NOMINAL / LIVE DATA"}
                        </p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     {symbols.slice(0, 2).map((s) => (
                        <button 
                           key={s.id}
                           onClick={() => setActiveSymbol(s.id)}
                           className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all border ${activeSymbol === s.id ? 'bg-primary text-background border-primary' : 'bg-surface/50 text-foreground-muted border-surface hover:border-primary/30'}`}
                        >
                           {s.name}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="flex-1 rounded-2xl overflow-hidden border border-white/5 bg-black/40 relative z-10 group/chart">
                  <TradingViewWidget 
                    symbol={activeSymbol} 
                    locale={locale} 
                    height="100%" 
                    autosize 
                  />
               </div>
            </div>
            
            {/* Real-time Signals Float */}
            <div className="absolute top-10 right-10 space-y-4 pointer-events-none">
               {signals.slice(0, 2).map((signal, idx) => (
                 <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 + (idx * 0.2) }}
                    key={signal._id} 
                    className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 shadow-2xl"
                 >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${signal.direction === 'buy' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                       {signal.direction === 'buy' ? 'LONG' : 'SHORT'}
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">{signal.symbol}</p>
                       <p className="text-xs font-bold font-mono">Entry @ {signal.entryPrice}</p>
                    </div>
                 </motion.div>
               ))}
            </div>

         </motion.div>

         {/* Background Decoration */}
         <div className="absolute -inset-10 border border-primary/10 rounded-[5rem] -z-10 animate-pulse"></div>
      </div>
    </section>
  );
}
