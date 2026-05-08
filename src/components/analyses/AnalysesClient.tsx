"use client";

import { motion } from "framer-motion";
import { Play, Lock, Clock, Video, Info, TrendingUp, TrendingDown, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";

interface AnalysisItem {
  _id: string;
  title: string;
  description: string;
  symbol: string;
  direction: 'buy' | 'sell';
  entryPrice?: string;
  targetPrice?: string;
  stopLoss?: string;
  chartUrl?: string | string[];
  videoUrl?: string;
  type: string;
  createdAt: string;
}

interface AnalysesClientProps {
  analyses: AnalysisItem[];
  liveAnalysis: AnalysisItem | null;
  hasAccess: boolean;
  isRtl: boolean;
}

export default function AnalysesClient({ analyses, liveAnalysis, hasAccess, isRtl }: AnalysesClientProps) {
  const t = useTranslations('Analyses');

  if (!hasAccess) {
    return (
      <div className="bg-surface/30 border border-surface rounded-[3rem] p-16 text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-20 -z-0 blur-3xl group-hover:opacity-40 transition-opacity"></div>
        <Lock size={300} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/5 -z-0" />
        
        <div className="relative z-10 space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 shadow-xl shadow-primary/5 group-hover:rotate-12 transition-transform duration-500">
             <Lock className="text-primary" size={40} />
          </div>
          <div className="space-y-3">
             <h2 className="text-4xl font-black tracking-tight">{t('no_access')}</h2>
             <p className="text-foreground-muted text-lg max-w-md mx-auto font-medium leading-relaxed">
                {t('no_access_desc')}
             </p>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link 
               href="/courses" 
               className="px-10 py-5 rounded-2xl bg-primary text-background font-black hover:bg-primary-hover transition-all inline-flex items-center gap-3 shadow-2xl shadow-primary/20"
             >
               {t('subscribe_now')}
             </Link>
             <Link 
               href="/" 
               className="px-10 py-5 rounded-2xl bg-surface/50 text-foreground font-bold hover:bg-surface transition-all border border-surface"
             >
               {isRtl ? 'العودة للرئيسية' : 'Back to Home'}
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {/* Live Stream Section */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black">{isRtl ? <>جلسة <span className="text-primary">مباشرة</span></> : <>Live <span className="text-primary">Session</span></>}</h2>
          {liveAnalysis && (
            <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-red-500/10 text-red-500 font-black text-xs animate-pulse border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              LIVE NOW
            </div>
          )}
        </div>
        
        {liveAnalysis ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group rounded-[4rem] bg-black border border-surface overflow-hidden relative shadow-2xl aspect-video max-w-5xl mx-auto cursor-pointer"
          >
            <div className="absolute inset-0 flex items-center justify-center text-center space-y-6 flex-col z-20">
              <div className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]">
                <Play size={48} className="text-primary fill-primary ml-1" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white">{liveAnalysis.title}</h3>
                <p className="text-primary font-black text-xs tracking-[0.3em] uppercase">Premium Live Intel</p>
              </div>
            </div>
            {/* Placeholder Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974717482-996e7a041f8f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"></div>
          </motion.div>
        ) : (
          <div className="rounded-[4rem] bg-surface/10 border-2 border-dashed border-surface p-24 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-surface/30 flex items-center justify-center mx-auto text-foreground-muted/20">
               <Video size={40} />
            </div>
            <p className="text-foreground-muted font-black italic max-w-md mx-auto leading-relaxed">
              {isRtl ? 'لا توجد جلسات مباشرة حالياً. سيتم إخطارك عند بدء أي تحليل جديد.' : 'No live sessions currently. You will be notified when a new analysis starts.'}
            </p>
          </div>
        )}
      </section>

      {/* Analysis Archive - Custom Redesign */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-surface pb-10">
          <h3 className="text-4xl font-black italic tracking-tighter uppercase">{isRtl ? <>الأرشيف <span className="text-primary">الفني</span></> : <>Technical <span className="text-primary">Archive</span></>}</h3>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface/50 border border-surface text-xs font-black italic text-foreground-muted uppercase tracking-widest">
            <Clock size={14} className="text-primary" /> {analyses.length} {isRtl ? 'جلسة' : 'Sessions'}
          </div>
        </div>
        
        <div className="grid gap-20">
          {analyses.length > 0 ? (
            analyses.map((item, i) => (
              <motion.article 
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-2 gap-16 items-start"
              >
                {/* Visual Side */}
                <div className="space-y-6">
                   <div className="relative group rounded-[3rem] overflow-hidden border border-surface bg-surface shadow-2xl">
                      {item.chartUrl ? (
                        Array.isArray(item.chartUrl) ? (
                          <div className="grid gap-4">
                            {item.chartUrl.map((url, idx) => (
                              <div key={idx} className="relative aspect-video">
                                <Image src={url} alt={item.title} fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="relative aspect-video">
                             <Image src={item.chartUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                <div className="flex items-center gap-3 text-white font-black text-xs uppercase italic tracking-widest">
                                   <ImageIcon size={16} className="text-primary" /> Full Chart Insight
                                </div>
                             </div>
                          </div>
                        )
                      ) : (
                        <div className="aspect-video bg-black flex items-center justify-center">
                           <span className="text-primary/20 font-black italic text-4xl">KERO VISUALS</span>
                        </div>
                      )}
                   </div>
                   
                   {/* Direction & Metadata */}
                   <div className="flex items-center gap-6">
                      <div className={`px-6 py-3 rounded-2xl font-black text-sm italic uppercase tracking-widest flex items-center gap-3 ${item.direction === 'buy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                         {item.direction === 'buy' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                         {item.direction === 'buy' ? 'Bullish / Long' : 'Bearish / Short'}
                      </div>
                      <div className="px-6 py-3 rounded-2xl bg-surface/50 border border-surface text-foreground-muted font-black text-[10px] uppercase tracking-[0.2em] italic">
                         {new Date(item.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                   </div>
                </div>

                {/* Content Side */}
                <div className={`space-y-10 ${isRtl ? 'text-right' : 'text-left'}`}>
                   <div className="space-y-4">
                      <h4 className="text-primary font-black text-sm tracking-[0.3em] uppercase italic">Market Intel</h4>
                      <h2 className="text-4xl lg:text-5xl font-black tracking-tighter italic uppercase leading-none">{item.symbol}</h2>
                      <h3 className="text-2xl font-bold text-foreground-muted italic">{item.title}</h3>
                   </div>

                   <div className={`text-lg leading-relaxed font-medium italic text-foreground/80 whitespace-pre-line border-primary/20 ${isRtl ? 'border-r-4 pr-8' : 'border-l-4 pl-8'}`}>
                      {item.description}
                   </div>

                   {/* Disclaimer Section - Requested Design */}
                   <div className="pt-10 space-y-8 border-t border-surface/50">
                      <div className="bg-surface/30 rounded-3xl p-8 border border-surface space-y-4">
                         <div className={`flex items-center gap-3 text-primary font-black italic uppercase text-xs tracking-widest ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Info size={16} /> {isRtl ? 'إخلاء مسؤولية' : 'إخلاء مسؤولية'}
                         </div>
                         <p className="text-xs text-foreground-muted leading-relaxed font-bold italic">
                            {isRtl ? 
                              'التحليل المنشور هو قراءة فنية تعليمية لحركة السوق، وليس توصية مباشرة للبيع أو الشراء. التداول عالي المخاطر، وكل متداول مسؤول بشكل كامل عن قراراته وإدارة رأس مال' : 
                              'The published analysis is a technical educational reading of market movement, not a direct recommendation for buying or selling. Trading involves high risk, and every trader is fully responsible for their decisions and capital management.'}
                         </p>
                      </div>

                      <div className="flex items-center gap-4 text-primary font-black italic text-xl tracking-tighter">
                         <div className="w-12 h-px bg-primary/30"></div>
                         — Kero Trade 📊
                      </div>
                   </div>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="py-32 text-center text-foreground-muted italic font-bold opacity-30 text-2xl">
              {isRtl ? 'لا توجد تحليلات مؤرشفة بعد.' : 'No archived analyses yet.'}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
