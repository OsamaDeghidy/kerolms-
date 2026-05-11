import { Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";
import { 
  Users, 
  BarChart3, 
  Target, 
  ShieldCheck, 
  Video, 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAnalysesAction } from "@/app/actions/analysis";
import TradingViewWidget from "@/components/TradingViewWidget";
import HeroSection from "@/components/home/HeroSection";
import TradingChartAnimation from "@/components/home/TradingChartAnimation";
import { StatCard, FeatureCard } from "@/components/home/Cards";

export default async function Home() {
  const t = await getTranslations('HomePage');
  const locale = await getLocale();
  const isRtl = locale === 'ar';
  
  // Fetch data on server
  const signals = await getAnalysesAction();
  const limitedSignals = signals.slice(0, 5);

  const symbols = [
    { id: "TVC:GOLD", name: isRtl ? "ذهب" : "Gold", icon: "💎" },
    { id: "FX:EURUSD", name: isRtl ? "يورو" : "Euro", icon: "€" },
    { id: "TVC:USOIL", name: isRtl ? "نفط" : "Oil", icon: "🛢️" },
  ];

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

        {/* Hero Section: Render as Client for interactivity */}
        <HeroSection 
          isRtl={isRtl} 
          signals={limitedSignals} 
          locale={locale} 
        />

        {/* Signals Ticker */}
        <div className="bg-surface/30 backdrop-blur-md border-y border-surface py-2 overflow-hidden relative z-20 h-16 flex items-center">
            <TradingViewWidget type="ticker" locale={locale} height={48} />
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
              <h2 className="text-2xl lg:text-4xl font-black uppercase italic tracking-tighter leading-tight">
                {t.rich('features_title', {
                  span: (chunks) => <span className="text-primary text-glow-primary">{chunks}</span>
                })}
              </h2>
            </div>
            <p className={`text-foreground-muted text-base lg:text-lg max-w-md font-medium italic border-surface ${isRtl ? 'border-r-4 pr-8 text-right' : 'border-l-4 pl-8 text-left'}`}>
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

        {/* Asset Grid Section */}
        <section className="container mx-auto px-6 py-32 relative z-10">
           <div className={`flex items-center justify-between mb-16 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter">
                 {isRtl ? <>مراقبة <span className="text-primary">الأسواق</span> المباشرة</> : <>Live <span className="text-primary">Market</span> Intelligence</>}
              </h2>
              <div className="w-32 h-1 bg-primary/20 rounded-full"></div>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {symbols.slice(1).map((s) => (
                 <div key={s.id} className="bg-surface/30 backdrop-blur-xl border border-surface rounded-[3rem] p-8 space-y-6 hover:border-primary/30 transition-all group overflow-hidden relative">
                    <div className="flex items-center justify-between relative z-10">
                       <div className="flex items-center gap-4">
                          <div className="text-3xl">{s.icon}</div>
                          <h4 className="text-xl font-black italic uppercase">{s.name}</h4>
                       </div>
                       <Link 
                          href="/analyses"
                          className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all"
                       >
                          <TrendingUp size={20} />
                       </Link>
                    </div>
                    <div className="h-48 rounded-2xl overflow-hidden border border-white/5">
                       <TradingViewWidget symbol={s.id} type="mini-chart" locale={locale} />
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* Course Explorer Teaser */}
        <section className="container mx-auto px-6 py-32 bg-surface/10 rounded-[5rem] border border-surface/50 mb-32 relative z-10 overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
           <div className={`flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`space-y-8 max-w-lg ${isRtl ? 'text-right' : 'text-left'}`}>
                 <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter leading-tight">
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
