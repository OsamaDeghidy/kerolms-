"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/routing";
import { 
  BookOpen, 
  Video, 
  Calendar, 
  Clock, 
  ChevronRight, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Sparkles,
  ArrowUpRight,
  MonitorPlay
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { getStudentDashboardAction } from "@/app/actions/student";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import LiveSchedule from "@/components/dashboard/LiveSchedule";
import ResourceCenter from "@/components/dashboard/ResourceCenter";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("learning"); // learning, live, resources, settings

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (session?.user?.role === "admin") {
      router.push("/admin");
      return;
    }

    if (status === "authenticated") {
      getStudentDashboardAction().then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [status, session, router]);

  if (loading || status === "loading" || session?.user?.role === "admin") return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="space-y-2">
           <h2 className="text-2xl font-black italic uppercase tracking-tighter">{t('preparing')}</h2>
           <p className="text-foreground-muted font-medium italic animate-pulse">{t('preparing_subtitle')}</p>
        </div>
    </div>
  );

  const tabs = [
    { id: "learning", label: t('my_courses'), icon: BookOpen },
    { id: "live", label: t('live_sessions'), icon: Video },
    { id: "resources", label: t('resources'), icon: FileText },
    { id: "settings", label: t('settings'), icon: Settings },
  ];

  const firstName = data?.user?.name?.split(' ')[0] || "";

  return (
    <div className="flex flex-col min-h-screen bg-background" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="flex-1 pt-32 pb-20 overflow-hidden relative">
        {/* Dynamic Background */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <header className={`mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
             <div className={`space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                   <Sparkles size={12} /> {t('student_hub')}
                </div>
                <h1 className="text-6xl font-black italic tracking-tighter leading-none">
                   {t('title')?.split(' ')[0]} <span className="text-primary">{t('title')?.split(' ')[1]}</span>
                </h1>
                <p className="text-foreground-muted text-lg font-medium italic tracking-wide">
                   {firstName ? t('welcome', { name: firstName }) : t('welcome_fallback')}
                </p>
             </div>

             <div className={`flex bg-surface/30 backdrop-blur-xl p-2 rounded-[2rem] border border-surface shadow-2xl ${isRtl ? 'flex-row-reverse' : ''}`}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black transition-all relative overflow-hidden group ${activeTab === tab.id ? 'text-background' : 'text-foreground-muted hover:text-foreground'} ${isRtl ? 'flex-row-reverse' : ''}`}
                  >
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabBg"
                        className="absolute inset-0 bg-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <tab.icon size={18} className="relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
             </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="min-h-[500px]"
            >
              {activeTab === "learning" && (
                <div className="space-y-10">
                   {/* Progress Overview Section */}
                   <div className="grid sm:grid-cols-3 gap-8 mb-12">
                      <div className={`bg-surface/20 border border-surface p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-primary/20 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}>
                         <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted group-hover:text-primary">{t('enrolled')}</p>
                            <p className="text-3xl font-black italic">{t('courses_count', { count: data?.enrolledCourses?.length || 0 })}</p>
                         </div>
                         <div className="w-14 h-14 bg-background/50 rounded-2xl flex items-center justify-center border border-surface"><MonitorPlay size={24} className="text-primary" /></div>
                      </div>
                      <div className={`bg-surface/20 border border-surface p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-primary/20 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}>
                         <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted group-hover:text-primary">{t('avg_progress')}</p>
                            <p className="text-3xl font-black italic">
                               {Math.round((data?.enrolledCourses?.reduce((acc: number, curr: any) => acc + curr.progress, 0) || 0) / (data?.enrolledCourses?.length || 1))}%
                            </p>
                         </div>
                         <div className="w-14 h-14 bg-background/50 rounded-2xl flex items-center justify-center border border-surface"><LayoutDashboard size={24} className="text-primary" /></div>
                      </div>
                      <div className={`bg-primary p-8 rounded-[2.5rem] text-background flex items-center justify-between shadow-2xl hover:scale-[1.02] transition-transform ${isRtl ? 'flex-row-reverse' : ''}`}>
                         <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{t('certificates')}</p>
                            <p className="text-3xl font-black italic">{t('certificates_count', { count: 0 })}</p>
                         </div>
                         <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md"><Sparkles size={24} /></div>
                      </div>
                   </div>

                   {data?.enrolledCourses?.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                      {data.enrolledCourses.map((course: any) => (
                        <div key={course._id} className="group relative bg-surface/30 backdrop-blur-xl rounded-[3rem] border border-surface hover:border-primary/30 transition-all shadow-2xl overflow-hidden flex flex-col">
                          
                          <div className="aspect-video relative overflow-hidden">
                             <img src={course.thumbnail || "/course-placeholder.jpg"} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                             <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                             {course.progress === 100 && (
                                <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} px-4 py-2 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2`}>
                                   <Sparkles size={12} /> {t('completed')}
                                </div>
                             )}
                          </div>

                          <div className={`p-10 space-y-6 flex-1 flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
                             <div className="space-y-2">
                                <h3 className="text-2xl font-black italic leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                                <div className={`flex items-center gap-3 text-xs font-bold text-foreground-muted uppercase tracking-tighter italic ${isRtl ? 'flex-row-reverse' : ''}`}>
                                   <span>{course.level}</span>
                                   <span className="w-1.5 h-1.5 bg-surface rounded-full"></span>
                                   <span>{t('total_duration', { duration: course.duration })}</span>
                                </div>
                             </div>

                             <div className="space-y-3">
                                <div className={`flex justify-between items-end ${isRtl ? 'flex-row-reverse' : ''}`}>
                                   <span className="text-xs font-black uppercase tracking-widest text-foreground-muted italic">{t('progress_label')}</span>
                                   <span className="text-xl font-black font-mono">{course.progress}%</span>
                                </div>
                                <div className="h-2.5 bg-surface rounded-full overflow-hidden border border-surface/50">
                                   <div className="h-full bg-gradient-to-r from-primary to-primary-hover shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                                </div>
                             </div>

                             <div className="pt-6 mt-auto">
                                <Link 
                                  href={`/courses/${course.slug}`}
                                  className="w-full py-5 rounded-[1.5rem] bg-primary text-background font-black flex items-center justify-center gap-3 hover:bg-primary-hover transition-all shadow-xl group/btn"
                                >
                                  {t('continue_course')} 
                                  <div className={`w-8 h-8 rounded-full bg-background/10 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`}>
                                     <ArrowUpRight size={18} />
                                  </div>
                                </Link>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 bg-surface/10 rounded-[4rem] border border-dashed border-surface space-y-8">
                       <div className="w-24 h-24 bg-surface/30 rounded-[2.5rem] flex items-center justify-center mx-auto text-foreground-muted">
                          <BookOpen size={48} />
                       </div>
                       <div className="space-y-4">
                          <p className="text-2xl font-black italic tracking-tighter text-foreground-muted">{t('no_courses')}</p>
                          <Link href="/courses" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary text-background font-black shadow-2xl hover:scale-105 transition-all text-lg">
                            {t('browse_courses')} <ChevronRight size={22} className={isRtl ? 'rotate-180' : ''} />
                          </Link>
                       </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "live" && (
                <LiveSchedule sessions={data?.upcomingSessions} />
              )}

              {activeTab === "resources" && (
                <ResourceCenter courses={data?.enrolledCourses} />
              )}

              {activeTab === "settings" && (
                <ProfileSettings initialData={data?.user} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
