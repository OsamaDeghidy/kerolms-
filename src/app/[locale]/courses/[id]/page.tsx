"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Target, 
  Trophy, 
  Users, 
  Clock, 
  BookOpen, 
  Star, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  CreditCard
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import BunnyPlayer from "@/components/BunnyPlayer";
import { getSecureAction } from "@/app/actions/bunny";
import { getCourseBySlugAction } from "@/app/actions/courses";
import { useEffect, useState } from "react";

export default function CourseLandingPage() {
  const t = useTranslations('Courses');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    const fetchCourse = async () => {
      const data = await getCourseBySlugAction(id as string);
      if (data) {
        setCourse(data);
      }
      setLoading(false);
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (course?.videoTrailerUrl) {
      getSecureAction(course.videoTrailerUrl).then(url => setVideoUrl(url));
    }
  }, [course?.videoTrailerUrl]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
       <h1 className="text-4xl font-black mb-4">{t('course_details.course_not_found')}</h1>
       <Link href="/courses" className="text-primary hover:underline">{t('back_to_home')}</Link>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 overflow-x-hidden">
        {/* Hero Section / Trailer */}
        <section className="container mx-auto px-4 grid lg:grid-cols-5 gap-12 mb-20">
          <div className="lg:col-span-3 space-y-6">
            <Link href="/courses" className="inline-flex items-center gap-2 text-primary font-bold hover:underline mb-4">
               {isRtl ? <ArrowLeft size={20} className="rotate-180" /> : <ArrowLeft size={20} />}
               {t('back_to_home')}
            </Link>
            <h1 className="text-4xl lg:text-6xl font-black leading-tight">
               {course.title}
            </h1>
            <p className="text-xl text-foreground-muted leading-relaxed max-w-2xl font-medium">
               {course.description.slice(0, 160)}...
            </p>
            
            <div className="flex flex-wrap gap-6 pt-6">
               <div className="flex items-center gap-2 text-foreground-muted">
                  <div className="w-10 h-10 rounded-full bg-surface border border-surface flex items-center justify-center text-primary">
                     <Clock size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs">{t('course_details.duration')}</span>
                     <span className="font-bold text-foreground">{course.duration || "N/A"}</span>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-foreground-muted">
                  <div className="w-10 h-10 rounded-full bg-surface border border-surface flex items-center justify-center text-primary">
                     <BookOpen size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs">{t('course_details.lessons')}</span>
                     <span className="font-bold text-foreground">{course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0}</span>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-foreground-muted">
                  <div className="w-10 h-10 rounded-full bg-surface border border-surface flex items-center justify-center text-primary">
                     <TrendingUp size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs">{t('course_details.level')}</span>
                     <span className="font-bold text-foreground capitalize">{course.level || "Beginner"}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2">
             <div className="bg-surface/30 border border-surface rounded-3xl p-8 sticky top-32 shadow-2xl space-y-8">
                {/* Video Placeholder */}
                <div className="aspect-video bg-black rounded-2xl relative overflow-hidden group border border-surface/50 shadow-2xl">
                   {videoUrl ? (
                     <BunnyPlayer src={videoUrl} />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-foreground-muted animate-pulse">
                        <Play size={48} className="opacity-20" />
                     </div>
                   )}
                </div>

                <div className="space-y-4">
                   <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-black text-primary">${course.price}</span>
                      {course.oldPrice && <span className="text-xl text-foreground-muted line-through">${course.oldPrice}</span>}
                   </div>
                   
                   {course.isEnrolled ? (
                     <Link 
                       href={`/courses/${id}/watch`}
                       className="w-full py-5 rounded-2xl bg-green-500 text-white text-lg font-black hover:bg-green-600 transition-all shadow-xl flex items-center justify-center gap-3"
                     >
                        <Play size={24} />
                        {t('course_details.start_learning')}
                     </Link>
                   ) : (
                     <Link 
                       href={`/checkout/${id}`}
                       className="w-full py-5 rounded-2xl bg-primary text-background text-lg font-black hover:bg-primary-hover transition-all shadow-xl flex items-center justify-center gap-3"
                     >
                        <CreditCard size={24} />
                        {t('course_details.buy_now')}
                     </Link>
                   )}
                   
                   <div className="pt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-foreground-muted">
                         <ShieldCheck size={16} className="text-green-500" />
                         <span>{t('course_details.lifetime_access')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground-muted">
                         <Users size={16} className="text-blue-500" />
                         <span>{t('course_details.join_students')}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Content Breakdown */}
        <section className="container mx-auto px-4 grid lg:grid-cols-2 gap-20 py-20 border-t border-surface/50">
           <div className="space-y-12">
              <div>
                 <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                   <CheckCircle2 className="text-primary" />
                   {t('course_details.what_you_will_learn')}
                 </h2>
                 <div className="space-y-4">
                    {course.learnings?.map((item: string, i: number) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-surface/20 border border-surface hover:border-primary/20 transition-colors">
                         <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <ChevronRight size={14} className="text-primary" />
                         </div>
                         <p className="font-medium">{item}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div>
                 <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                   <Trophy className="text-primary" />
                   {t('course_details.expected_results')}
                 </h2>
                 <ul className="space-y-4">
                    {course.expectedResults?.map((item: string, i: number) => (
                      <li key={i} className="flex gap-3 items-center text-lg font-medium">
                         <Star size={20} className="text-primary fill-primary" />
                         {item}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>

           <div className="space-y-12">
              <div className="p-10 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                 <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 relative z-10">
                   <Target className="text-primary" />
                   {t('course_details.who_is_this_for')}
                 </h2>
                 <div className="space-y-6 relative z-10">
                    {course.targetAudience?.map((item: string, i: number) => (
                      <div key={i} className="flex gap-4 items-start">
                         <div className="w-2 h-2 rounded-full bg-primary mt-3"></div>
                         <p className="text-lg font-medium">{item}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Course Reviews Section Placeholder */}
              <div>
                 <h2 className="text-3xl font-bold mb-8">{t('course_details.reviews_title')}</h2>
                 <div className="grid gap-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="p-6 rounded-2xl bg-surface/30 border border-surface italic">
                         <div className="flex items-center gap-1 text-primary mb-3">
                            {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-current" />)}
                         </div>
                         <p className="text-foreground-muted">"{t('course_details.review_placeholder')}"</p>
                         <div className="mt-4 text-sm font-bold">- {t('course_details.registered_student')}</div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
