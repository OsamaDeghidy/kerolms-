"use client";

import { useEffect, useState, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { 
  ArrowLeft, 
  Play, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  CheckCircle,
  Menu,
  X,
  MessageSquare,
  ShieldCheck,
  Maximize2,
  ChevronLeft,
  Settings,
  ListVideo
} from "lucide-react";
import BunnyPlayer from "@/components/BunnyPlayer";
import { getSecureAction } from "@/app/actions/bunny";
import { getCourseBySlugAction } from "@/app/actions/courses";
import { motion, AnimatePresence } from "framer-motion";
import { useAntiPiracy } from "@/hooks/useAntiPiracy";
import SecurityWatermark from "@/components/streaming/SecurityWatermark";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

export default function CourseWatchPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { id, locale } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('Watch');
  const isRtl = locale === 'ar';
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTheatreMode, setIsTheatreMode] = useState(false);

  // Activate Anti-Piracy Measures
  useAntiPiracy(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const data = await getCourseBySlugAction(id);
      if (!data || !data.isEnrolled) {
        router.push(`/courses/${id}`);
        return;
      }
      setCourse(data);
      if (data.modules?.[0]?.lessons?.[0]) {
        setActiveLesson(data.modules[0].lessons[0]);
      }
      setLoading(false);
    };
    fetchCourse();
  }, [id, router]);

  useEffect(() => {
    if (activeLesson?.bunnyVideoId) {
      setVideoUrl("");
      getSecureAction(activeLesson.bunnyVideoId).then(url => setVideoUrl(url));
    }
  }, [activeLesson]);

  const currentModuleTitle = useMemo(() => {
    if (!course || !activeLesson) return "";
    return course.modules.find((m: any) => m.lessons.some((l: any) => l._id === activeLesson._id))?.title || "";
  }, [course, activeLesson]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
       <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute top-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden select-none relative" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Dynamic Watermark */}
      {session?.user?.email && <SecurityWatermark email={session.user.email} />}

      {/* Header - Transparent/Minimal */}
      <header className={`h-16 bg-surface/10 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-50 transition-all duration-500 ${isTheatreMode ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="flex items-center gap-6">
           <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-foreground-muted hover:text-primary transition-all hover:bg-white/10">
              {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
           </Link>
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest leading-none mb-1">{t('elite_hub')}</span>
              <h1 className="font-black text-sm text-white/90 hidden md:block uppercase tracking-tighter italic">
                 {course.title}
              </h1>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('secure_stream')}</span>
           </div>
           <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="w-10 h-10 rounded-xl bg-primary text-background flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
           >
              {sidebarOpen ? <X size={20} /> : <ListVideo size={20} />}
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content Area */}
        <main className={`flex-1 flex flex-col transition-all duration-500 ease-in-out`}>
           <div className={`relative transition-all duration-500 ${isTheatreMode ? 'h-full' : 'h-[60vh] lg:h-[70vh]'} bg-black group`}>
              
              {/* Theatre Mode Toggle - Floating */}
              <button 
                onClick={() => setIsTheatreMode(!isTheatreMode)}
                className={`absolute bottom-6 ${isRtl ? 'left-6 text-right' : 'right-6 text-left'} w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all z-20 flex items-center justify-center hover:bg-primary hover:text-background`}
              >
                 <Maximize2 size={20} />
              </button>

              <div className="absolute inset-0 flex items-center justify-center">
                 <AnimatePresence mode="wait">
                    {videoUrl ? (
                      <motion.div 
                        key={activeLesson?._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full"
                      >
                         <BunnyPlayer src={videoUrl} />
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center gap-6 text-foreground-muted">
                         <div className="relative">
                            <Play size={80} className="opacity-10" />
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping"></div>
                         </div>
                         <p className="font-black uppercase tracking-[0.2em] italic text-xs animate-pulse">
                            {t('encrypting')}
                         </p>
                      </div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
           
            {/* Lesson Info */}
            <div className={`bg-background transition-all duration-500 overflow-y-auto ${isTheatreMode ? 'h-0 opacity-0 pointer-events-none' : 'flex-1'}`}>
               <div className="p-10 space-y-8 max-w-5xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest">
                           <ShieldCheck size={14} />
                           <span>{currentModuleTitle}</span>
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">{activeLesson?.title}</h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-foreground-muted italic">
                           <span className="flex items-center gap-1.5"><Play size={14} className="text-primary" /> {activeLesson?.duration}</span>
                           <span className="w-1 h-1 bg-surface rounded-full"></span>
                           <span>{t('mastery_series')}</span>
                        </div>
                     </div>
                     <button className="px-10 py-4 rounded-[1.5rem] bg-primary/5 text-primary font-black text-sm hover:bg-primary hover:text-background transition-all border border-primary/20 shadow-xl flex items-center gap-2 group">
                        {t('mark_complete')}
                        <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                     </button>
                  </div>
                  
                  <div className="p-8 bg-surface/10 rounded-[2.5rem] border border-surface/50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none"></div>
                     <div className="prose prose-invert max-w-none">
                         <p className="text-foreground-muted leading-relaxed font-medium italic">
                            {t('lesson_welcome')}
                         </p>
                     </div>
                  </div>

                  {/* Discussion */}
                  <div className="pt-12 border-t border-surface space-y-10">
                     <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-4">
                           <div className="w-1 h-8 bg-primary"></div>
                           {t('discussion')}
                        </h3>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-surface/30 rounded-full border border-surface text-[10px] font-black italic text-foreground-muted uppercase">
                           <MessageSquare size={12} className="text-primary" />
                           {t('intel_shared', { count: 24 })}
                        </div>
                     </div>
                     
                     <div className="bg-surface/20 p-8 rounded-[2.5rem] border border-surface flex flex-col md:flex-row gap-6 items-start group hover:border-primary/20 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-primary text-background flex items-center justify-center font-black text-xl italic shrink-0 shadow-lg shadow-primary/10">
                           {session?.user?.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 w-full space-y-4">
                           <textarea 
                             placeholder={t('inquiry_placeholder')}
                             className="w-full bg-background/50 border border-surface rounded-[1.5rem] p-5 outline-none focus:border-primary/50 transition-all resize-none font-bold text-sm"
                             rows={3}
                           ></textarea>
                           <div className="flex justify-end">
                              <button className="px-10 py-3.5 rounded-2xl bg-primary text-background font-black text-sm hover:bg-primary-hover shadow-[0_15px_30px_rgba(var(--primary-rgb),0.3)] transition-all flex items-center gap-2 uppercase italic tracking-widest hover:-translate-y-1 active:scale-95 overflow-hidden group/btn relative">
                                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                                 <span className="relative z-10">{t('deploy_intel')}</span>
                                 <ArrowLeft size={16} className={`relative z-10 transition-transform group-hover/btn:translate-x-1 ${!isRtl ? 'rotate-180' : ''}`} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
        </main>

        {/* Sidebar - Enhanced Glassmorphism */}
        <aside 
          className={`absolute lg:relative top-0 bottom-0 ${isRtl ? 'left-0 border-r text-right' : 'right-0 border-l text-left'} w-[400px] h-full bg-surface/20 backdrop-blur-[50px] border-white/5 flex flex-col transition-all duration-700 ease-in-out z-40 ${sidebarOpen ? "translate-x-0 opacity-100" : (isRtl ? "-translate-x-full lg:w-0" : "translate-x-full lg:w-0") + " opacity-0"}`}
        >
           <div className="p-10 border-b border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-black text-xs uppercase tracking-[0.3em] text-foreground-muted">{t('hub_progress')}</h3>
                 <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">ELITE COURSE</span>
              </div>
              <div className="space-y-2">
                 <div className={`flex justify-between items-end mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-2xl font-black italic italic tracking-tighter uppercase whitespace-nowrap">{t('course_map')}</span>
                    <span className="text-primary font-black text-xs">0%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "10%" }}
                      className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                    ></motion.div>
                 </div>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              {course.modules?.map((module: any, mIndex: number) => (
                <div key={mIndex} className="border-b border-white/5">
                   <div className={`px-8 py-5 bg-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex flex-col ${isRtl ? 'items-end' : ''}`}>
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{t('module', { number: mIndex + 1 })}</span>
                        <h4 className="font-black text-sm uppercase italic tracking-tighter">{module.title}</h4>
                      </div>
                      <ChevronDown size={14} className="text-foreground-muted group-hover:text-primary transition-colors" />
                   </div>
                   <div className="py-2">
                      {module.lessons?.map((lesson: any, lIndex: number) => {
                         const isActive = activeLesson?._id === lesson._id;
                         return (
                           <button 
                             key={lIndex}
                             onClick={() => setActiveLesson(lesson)}
                             className={`w-full relative px-8 py-5 flex items-center gap-5 transition-all group overflow-hidden ${isActive ? "bg-primary/5" : "hover:bg-white/5"} ${isRtl ? 'flex-row-reverse' : ''}`}
                           >
                              {isActive && (
                                <motion.div 
                                  layoutId="active-indicator"
                                  className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-0 bottom-0 w-1 bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.8)]`}
                                />
                              )}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${isActive ? "bg-primary text-background border-primary rotate-12 scale-110 shadow-lg shadow-primary/20" : "bg-white/5 border-white/5 text-foreground-muted group-hover:border-primary/30 group-hover:text-primary"}`}>
                                 {isActive ? <Play size={18} className="fill-current" /> : (lIndex + 1)}
                              </div>
                              <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                                 <div className={`text-sm font-black italic tracking-tight uppercase leading-none mb-1.5 ${isActive ? "text-primary" : "text-white/80 group-hover:text-white transition-colors"}`}>{lesson.title}</div>
                                 <div className={`flex items-center gap-2 ${isRtl ? 'justify-end' : ''}`}>
                                    <div className="w-1 h-1 bg-surface rounded-full"></div>
                                    <div className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">{lesson.duration || "00:00"}</div>
                                 </div>
                              </div>
                           </button>
                         );
                      })}
                   </div>
                </div>
              ))}
           </div>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary-rgb), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary-rgb), 0.3);
        }
        .text-glow-primary {
          text-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4);
        }
      `}</style>
    </div>
  );
}
