"use client";

import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  PlayCircle, 
  Star, 
  TrendingUp, 
  ShieldCheck, 
  Video, 
  Users, 
  ArrowRight, 
  DollarSign, 
  ChevronRight, 
  Globe, 
  Zap, 
  Activity,
  BarChart3,
  Trophy,
  Target
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { getAnalysesAction } from "@/app/actions/analysis";

export default function Home() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [showCongrats, setShowCongrats] = useState(false);
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowCongrats(true), 5000);
    getAnalysesAction().then(res => setSignals(res.slice(0, 5)));
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <main className="flex-1 relative">
        {/* Cinematic Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[100vh] pointer-events-none overflow-hidden z-0">
           <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
           <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>
           <TradingChartAnimation />
        </div>

        {/* Hero Section: Institutional Grade */}
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
              <h1 className="text-6xl lg:text-8xl font-black italic tracking-tighter leading-[0.9] uppercase">
                {t.rich('hero_title', {
                  br: () => <br />,
                  span: (chunks) => <span className="text-primary text-glow-primary">{chunks}</span>
                })}
              </h1>
              <p className={`text-foreground-muted text-xl lg:text-2xl max-w-xl leading-relaxed italic font-medium border-primary/30 pl-6 ${isRtl ? 'border-r-4 pr-6 pl-0 text-right' : 'border-l-4 text-left'}`}>
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
                className="group relative px-12 py-6 rounded-[2rem] bg-primary text-background font-black transition-all flex items-center gap-4 text-xl shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <span className="relative z-10">{t('courses_button')}</span>
                <div className="relative z-10 w-10 h-10 rounded-full bg-background/20 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                   {isRtl ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                </div>
              </Link>
              
              <Link 
                href="#what-we-do" 
                className={`px-10 py-6 rounded-[2rem] border border-surface bg-surface/20 backdrop-blur-xl hover:bg-surface transition-all flex items-center gap-3 font-black text-lg group ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <PlayCircle size={28} className="text-primary" />
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
                     <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all cursor-pointer" />
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
                     span: (chunks) => <span className="text-foreground font-black text-glow-primary tracking-tighter">{chunks}</span>
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
                <TradingChartVisual />
                
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

                {/* Congrats Popup */}
                <AnimatePresence>
                  {showCongrats && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0, y: 50 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-primary text-background p-8 rounded-[2.5rem] shadow-[0_30px_60px_rgba(var(--primary-rgb),0.5)] flex flex-col items-center gap-4 border-t border-white/30"
                    >
                      <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center shadow-inner">
                         <Trophy size={40} className="text-primary animate-bounce" />
                      </div>
                      <div className="text-center">
                         <h4 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                           {t('target_reached')}
                         </h4>
                         <p className="text-lg font-bold opacity-80 italic">
                           {t('student_profit')}
                         </p>
                      </div>
                      <button 
                         onClick={() => setShowCongrats(false)}
                         className="px-6 py-2 rounded-full bg-background/10 hover:bg-background/20 text-[10px] font-black uppercase tracking-widest transition-colors"
                      >
                         {t('dismiss')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
             </motion.div>

             {/* Background Decoration */}
             <div className="absolute -inset-10 border border-primary/10 rounded-[5rem] -z-10 animate-pulse"></div>
          </div>
        </section>

        {/* Signals Ticker */}
        <div className="bg-surface/30 backdrop-blur-md border-y border-surface py-6 overflow-hidden relative z-20">
           <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`flex items-center gap-6 text-sm font-black uppercase italic tracking-tighter ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <div className={`flex items-center gap-2 text-primary ${isRtl ? 'flex-row-reverse' : ''}`}><Zap size={16} /> {t('live_signals')}</div>
                   <div className="flex items-center gap-2">BTC/USDT <span className="text-emerald-500">+4.2%</span></div>
                   <div className="w-2 h-2 rounded-full bg-surface"></div>
                   <div className="flex items-center gap-2">GOLD <span className="text-rose-500">-1.1%</span></div>
                   <div className="w-2 h-2 rounded-full bg-surface"></div>
                   <div className="flex items-center gap-2">ETH/USDT <span className="text-emerald-500">+12.5%</span></div>
                   <div className="w-2 h-2 rounded-full bg-surface"></div>
                </div>
              ))}
           </div>
        </div>

        {/* Trust Metrics Section */}
        <section className="container mx-auto px-6 py-32 relative z-10">
           <div className={`grid md:grid-cols-4 gap-12 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <StatCard label={t('success_rate')} val="94%" icon={<Target />} color="text-emerald-500" />
              <StatCard label={t('total_students')} val="+5,000" icon={<Users />} color="text-blue-500" />
              <StatCard label={t('analyses_shared')} val="+12,400" icon={<BarChart3 />} color="text-primary" />
              <StatCard label={t('trust_score')} val="4.9/5" icon={<ShieldCheck />} color="text-purple-500" />
           </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-32 border-t border-surface relative z-10" id="what-we-do">
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
            <div className={`max-w-2xl space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className={`inline-flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest italic ${isRtl ? 'flex-row-reverse' : ''}`}>
                 <div className="w-8 h-px bg-primary"></div> {t('values_badge')}
              </div>
              <h2 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter leading-none">
                {t.rich('features_title', {
                  span: (chunks) => <span className="text-primary text-glow-primary">{chunks}</span>
                })}
              </h2>
            </div>
            <p className={`text-foreground-muted text-xl max-w-md font-medium italic border-surface ${isRtl ? 'border-r-4 pr-8 text-right' : 'border-l-4 pl-8 text-left'}`}>
              {t('features_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Video />}
              title={t('feature_hd_title')}
              description={t('feature_hd_desc')}
              isRtl={isRtl}
            />
            <FeatureCard 
              icon={<ShieldCheck />}
              title={t('feature_sec_title')}
              description={t('feature_sec_desc')}
              isRtl={isRtl}
            />
            <FeatureCard 
              icon={<TrendingUp />}
              title={t('feature_market_title')}
              description={t('feature_market_desc')}
              isRtl={isRtl}
            />
          </div>
        </section>

        {/* Course Explorer Teaser */}
        <section className="container mx-auto px-6 py-32 bg-surface/10 rounded-[5rem] border border-surface/50 mb-32 relative z-10 overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
           <div className={`flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`space-y-8 max-w-lg ${isRtl ? 'text-right' : 'text-left'}`}>
                 <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                    {t.rich('evolution_title', {
                      span: (chunks) => <span className="text-primary">{chunks}</span>
                    })}
                 </h2>
                 <p className="text-foreground-muted font-bold italic leading-relaxed">
                    {t('evolution_desc')}
                 </p>
                 <Link href="/courses" className={`inline-flex items-center gap-4 text-primary font-black uppercase text-xl transition-transform italic ${isRtl ? 'hover:-translate-x-4 flex-row-reverse' : 'hover:translate-x-4'}`}>
                    {t('explore_catalog')} {isRtl ? <ArrowLeft /> : <ArrowRight />}
                 </Link>
              </div>
              <div className={`flex gap-6 overflow-hidden ${isRtl ? 'flex-row-reverse' : ''}`}>
                 {[1, 2].map(i => (
                    <div key={i} className={`w-80 h-[450px] bg-background border border-surface rounded-[3rem] p-8 shadow-2xl flex flex-col justify-between hover:-translate-y-6 transition-transform duration-500 ${isRtl ? 'text-right' : 'text-left'}`}>
                       <div className="space-y-4">
                          <div className={`w-16 h-16 rounded-2xl bg-surface flex items-center justify-center text-primary ${isRtl ? 'mr-auto ml-0' : 'ml-auto mr-0'}`}><BarChart3 size={32} /></div>
                          <h4 className="text-2xl font-black italic tracking-tight uppercase">Advanced Price Action</h4>
                          <p className="text-xs text-foreground-muted font-bold italic line-clamp-3">Master the core language of the markets without lagging indicators.</p>
                       </div>
                       <div className="space-y-2">
                          <div className={`flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary ${isRtl ? 'flex-row-reverse' : ''}`}>
                             <span>12 Modules</span>
                             <span>Entry Level</span>
                          </div>
                          <div className="w-full h-1 bg-surface rounded-full"></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({ label, val, icon, color }: { label: string, val: string, icon: any, color: string }) {
   return (
      <div className="bg-surface/20 p-10 rounded-[3rem] border border-surface text-center space-y-4 hover:border-primary/20 transition-all hover:shadow-2xl group">
         <div className={`w-16 h-16 rounded-2xl bg-background border border-surface flex items-center justify-center mx-auto ${color} group-hover:scale-110 transition-transform`}>
            {icon}
         </div>
         <div className="space-y-1">
            <h4 className="text-3xl font-black italic tracking-tighter">{val}</h4>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted">{label}</p>
         </div>
      </div>
   );
}

function TradingChartVisual() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const generateData = () => {
      let lastClose = 100;
      return Array.from({ length: 25 }).map((_, i) => {
        const open = lastClose;
        const change = (Math.random() - 0.4) * 30; // Biased upwards
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 8;
        const low = Math.min(open, close) - Math.random() * 8;
        lastClose = close;
        return { open, high, low, close, volume: Math.random() * 100 };
      });
    };
    setData(generateData());
    
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const open = last.close;
        const change = (Math.random() - 0.4) * 30;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 8;
        const low = Math.min(open, close) - Math.random() * 8;
        newData.push({ open, high, low, close, volume: Math.random() * 100 });
        return newData;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      {/* HUD Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5 relative z-20">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
               <TrendingUp size={20} />
            </div>
            <div>
               <h4 className="text-lg font-black tracking-tighter italic">MARKET ENGINE V2</h4>
               <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM NOMINAL / LIVE DATA
               </p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-2xl font-black font-mono tracking-tighter text-glow-primary">68,432.10</p>
            <p className="text-[10px] font-black text-foreground-muted italic transition-all">+2,44(0.42%)</p>
         </div>
      </div>
      
      {/* Chart Area */}
      <div className="flex-1 flex items-end gap-[4px] relative z-10 px-4">
        {data.map((item, i) => {
          const isUp = item.close >= item.open;
          const color = isUp ? "emerald-500" : "rose-500";
          const maxVal = Math.max(...data.map(d => d.high));
          const minVal = Math.min(...data.map(d => d.low));
          const range = maxVal - minVal;
          
          const bodyTop = ((maxVal - Math.max(item.open, item.close)) / range) * 100;
          const bodyHeight = (Math.abs(item.open - item.close) / range) * 100;
          const wickTop = ((maxVal - item.high) / range) * 100;
          const wickHeight = ((item.high - item.low) / range) * 100;

          return (
            <div key={i} className="flex-1 relative h-full flex flex-col justify-start">
              {/* Wick */}
              <div 
                className={`absolute left-1/2 -translate-x-1/2 bg-${color} opacity-40`}
                style={{ top: `${wickTop}%`, height: `${wickHeight}%`, width: '1px' }}
              ></div>
              {/* Body */}
              <motion.div 
                layout
                className={`absolute left-0 right-0 rounded-sm bg-${color} shadow-[0_0_15px_rgba(var(--${isUp ? 'emerald' : 'rose'}-rgb),0.3)]`}
                style={{ 
                  top: `${bodyTop}%`, 
                  height: `${Math.max(bodyHeight, 2)}%`,
                  '--emerald-rgb': '16, 185, 129',
                  '--rose-rgb': '244, 63, 94' 
                } as any}
              ></motion.div>
            </div>
          );
        })}
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
    </div>
  );
}

function TradingChartAnimation() {
  return (
    <div className="flex gap-4 items-end w-full h-full p-20 select-none opacity-20">
       {[...Array(60)].map((_, i) => (
         <motion.div 
            key={i}
            className={`w-6 rounded-t-3xl ${i % 8 === 0 ? 'bg-rose-500/30' : 'bg-primary/20'}`}
            animate={{ 
              height: [100, 300, 150, 400, 200][i % 5] + "px"
            }}
            transition={{ 
              duration: 4 + (i * 0.1), 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "circInOut"
            }}
         />
       ))}
    </div>
  )
}

function FeatureCard({ icon, title, description, isRtl }: { icon: React.ReactNode, title: string, description: string, isRtl: boolean }) {
  return (
    <div className={`p-10 rounded-[3rem] bg-surface/30 backdrop-blur-xl border border-surface hover:border-primary/40 transition-all duration-500 flex flex-col items-start ${isRtl ? 'text-right' : 'text-left'} group hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden`}>
      <div className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} w-32 h-32 bg-primary/5 rounded-full blur-3xl ${isRtl ? '-ml-16' : '-mr-16'} -mt-16 group-hover:bg-primary/10 transition-colors`}></div>
      
      <div className={`w-20 h-20 rounded-[2rem] bg-background border border-surface flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-2xl relative z-10 text-primary ${isRtl ? 'mr-auto ml-0' : ''}`}>
        {icon}
      </div>
      <div className="relative z-10 space-y-4 w-full">
         <h3 className="text-2xl font-black italic tracking-tighter uppercase">{title}</h3>
         <p className="text-foreground-muted leading-relaxed font-medium italic">{description}</p>
      </div>
    </div>
  );
}
