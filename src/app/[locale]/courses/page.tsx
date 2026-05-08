import { Link } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Globe, 
  Target
} from "lucide-react";
import * as motion from "framer-motion/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllCoursesAction } from "@/app/actions/courses";
import CoursesList from "@/components/courses/CoursesList";

export default async function CoursesPage() {
  const t = await getTranslations('Courses');
  const locale = await getLocale();
  const isRtl = locale === 'ar';
  
  const courses = await getAllCoursesAction();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 relative pb-40">
        {/* Cinematic Background */}
        <div className="absolute top-0 left-0 w-full h-[50vh] pointer-events-none overflow-hidden z-0">
           <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
           <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>
           <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
              backgroundSize: '30px 30px'
           }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-32">
          {/* Back Button */}
          <div className="mb-8">
             <Link href="/" className="inline-flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors font-bold group">
                {isRtl ? <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /> : <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />}
                {t('back_to_home')}
             </Link>
          </div>

          {/* Discovery Hero */}
          <section className="mb-24 space-y-10">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface/50 backdrop-blur-md border border-surface text-primary text-xs font-black uppercase tracking-[0.2em]">
               <Globe size={14} className="animate-spin-slow" />
               <span>{t('academy_badge')}</span>
            </div>

            <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
               <div className={`space-y-6 max-w-3xl ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h1 className="text-6xl lg:text-7xl font-black italic tracking-tighter leading-[0.9] uppercase">
                    {t.rich('hero_title', {
                      br: () => <br />,
                      span: (chunks) => <span className="text-primary text-glow-primary">{chunks}</span>
                    })}
                  </h1>
                  <p className={`text-foreground-muted text-xl lg:text-2xl font-medium leading-relaxed italic border-primary/30 pl-6 ${isRtl ? 'border-r-4 pr-6 pl-0' : 'border-l-4'}`}>
                    {t('hero_subtitle')}
                  </p>
               </div>

               <div className={`bg-surface/30 backdrop-blur-xl border border-surface p-8 rounded-[2.5rem] flex gap-10 shadow-2xl ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <MetricItem icon={<BookOpen />} label={t('metric_courses')} val={courses.length.toString()} />
                  <div className="w-px h-12 bg-surface"></div>
                  <MetricItem icon={<Users />} label={t('metric_students')} val="+2.5K" />
                  <div className="w-px h-12 bg-surface"></div>
                  <MetricItem icon={<Target />} label={t('metric_success')} val="94%" />
               </div>
            </div>
          </section>

          <CoursesList initialCourses={courses} isRtl={isRtl} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function MetricItem({ icon, label, val }: { icon: any, label: string, val: string }) {
   return (
      <div className="text-center space-y-1">
         <div className="flex items-center justify-center gap-2 text-primary">
            {icon}
            <span className="text-2xl font-black font-mono tracking-tighter text-foreground">{val}</span>
         </div>
         <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">{label}</p>
      </div>
   );
}
