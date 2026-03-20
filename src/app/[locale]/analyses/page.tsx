"use client";

import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, Lock, Clock, Calendar, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { getAnalysesAction, getLiveAnalysisAction } from "@/app/actions/analysis";

export default function AnalysesPage() {
  const { data: session, status } = useSession();
  const t = useTranslations('Analyses');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [liveAnalysis, setLiveAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // @ts-ignore
  const hasAccess = session?.user?.hasAnalysisAccess || session?.user?.role === "admin"; 

  useEffect(() => {
    if (status === "authenticated" && hasAccess) {
      Promise.all([
        getAnalysesAction(),
        getLiveAnalysisAction()
      ]).then(([all, live]) => {
        setAnalyses(all);
        setLiveAnalysis(live);
        setLoading(false);
      });
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, hasAccess]);

  if (status === "loading" || (status === "authenticated" && loading)) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
       <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
       <p className="text-foreground-muted italic font-medium">جاري التحقق من صلاحيات الوصول...</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
               {isRtl ? <>التحليلات <span className="text-primary italic">البريميوم</span></> : <>Premium <span className="text-primary italic">Analyses</span></>}
            </h1>
            <p className="text-foreground-muted text-lg font-medium">{t('subtitle')}</p>
          </div>

          {!hasAccess ? (
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
                       العودة للرئيسية
                     </Link>
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-16">
               {/* Live Stream Section */}
               <section className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-3xl font-black">جلسة <span className="text-primary">مباشرة</span></h2>
                     {liveAnalysis && (
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 text-red-500 font-black text-xs animate-pulse border border-red-500/20">
                           <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                           LIVE NOW
                        </div>
                     )}
                  </div>
                  
                  {liveAnalysis ? (
                     <div className="group rounded-[3rem] bg-black border border-surface overflow-hidden relative shadow-2xl aspect-video max-w-5xl mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center text-center space-y-6 flex-col z-10">
                           <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                              <Play size={40} className="text-primary fill-primary ml-1" />
                           </div>
                           <div className="space-y-2">
                              <h3 className="text-2xl font-black text-white">{liveAnalysis.title}</h3>
                              <p className="text-primary font-bold text-sm tracking-widest uppercase">Premium Live Session</p>
                           </div>
                        </div>
                        {/* Placeholder Backdrop */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974717482-996e7a041f8f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700 delay-100"></div>
                     </div>
                  ) : (
                     <div className="rounded-[3rem] bg-surface/20 border-2 border-dashed border-surface p-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-surface/50 flex items-center justify-center mx-auto text-foreground-muted/30">
                           <Video size={32} />
                        </div>
                        <p className="text-foreground-muted font-bold">لا توجد جلسات مباشرة حالياً. سيتم إخطارك عند بدء أي تحليل.</p>
                     </div>
                  )}
               </section>

               {/* Archived Sections */}
               <section className="space-y-8">
                  <div className="flex items-center justify-between border-b border-surface pb-6">
                     <h3 className="text-3xl font-black">الأرشيف <span className="text-primary">التعليمي</span></h3>
                     <span className="text-sm font-bold text-foreground-muted">{analyses.length} جلسة مؤرشفة</span>
                  </div>
                  
                  {analyses.length > 0 ? (
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {analyses.map((item, i) => (
                           <div key={item._id} className="group p-6 rounded-[2.5rem] bg-surface/30 border border-surface hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                              <div className="aspect-video bg-black rounded-3xl mb-6 relative overflow-hidden shadow-lg">
                                 <div className="absolute inset-0 flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                    <div className="w-12 h-12 rounded-2xl bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                       <Play size={20} className="text-primary fill-primary" />
                                    </div>
                                 </div>
                                 <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md text-[10px] font-black text-white border border-white/5 uppercase tracking-tighter">
                                    {item.type}
                                 </div>
                              </div>
                              <h4 className="text-xl font-black mb-3 group-hover:text-primary transition-colors">{item.title}</h4>
                              <p className="text-sm text-foreground-muted line-clamp-2 mb-6 font-medium leading-relaxed">
                                 {item.description}
                              </p>
                              <div className="flex items-center justify-between pt-4 border-t border-surface/50">
                                 <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-foreground-muted uppercase tracking-widest"><Clock size={12} className="text-primary" /> Recorded</span>
                                 </div>
                                 <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-md">
                                    {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                                 </span>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="py-20 text-center text-foreground-muted italic font-bold opacity-50">لا توجد تحليلات سابقة في الأرشيف بعد.</div>
                  )}
               </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
