"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  PlayCircle, 
  Users, 
  Search, 
  Filter, 
  Layout, 
  ShieldCheck,
  Zap,
  Star
} from "lucide-react";
import Image from "next/image";

export default function CoursesList({ initialCourses, isRtl }: { initialCourses: any[], isRtl: boolean }) {
  const t = useTranslations('Courses');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const cats = ["all", ...new Set(initialCourses.map(c => c.category || "General"))];
    return cats;
  }, [initialCourses]);

  const filteredCourses = useMemo(() => {
    return initialCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory || (selectedCategory === "General" && !course.category);
      return matchesSearch && matchesCategory;
    });
  }, [initialCourses, searchQuery, selectedCategory]);

  return (
    <>
      {/* Interactive Control Bar */}
      <section className={`sticky top-24 z-40 mb-16 px-8 py-6 rounded-[2.5rem] bg-surface/40 backdrop-blur-2xl border border-surface shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 group hover:border-primary/20 transition-all ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
         <div className="relative w-full lg:w-[400px]">
            <Search size={20} className={`absolute ${isRtl ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-foreground-muted group-hover:text-primary transition-colors`} />
            <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={t('search_placeholder')}
               className={`w-full bg-background/50 border border-surface rounded-2xl py-4 ${isRtl ? 'pr-14 pl-6 text-right' : 'pl-14 pr-6 text-left'} text-sm font-bold focus:outline-none focus:border-primary/50 transition-all`}
            />
         </div>

         <div className={`flex flex-wrap items-center justify-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            {categories.map((cat) => (
               <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     selectedCategory === cat 
                     ? 'bg-primary text-background shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3)]' 
                     : 'bg-surface/50 border border-surface text-foreground-muted hover:border-primary/30 hover:text-foreground'
                  }`}
               >
                  {cat === "all" ? t('filter_all') : (cat === "General" ? t('filter_all') : cat)}
               </button>
            ))}
         </div>
      </section>

      {/* Elite Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
           {filteredCourses.map((course, idx) => (
             <motion.div 
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                key={course._id} 
                className="group rounded-[3rem] bg-surface/20 p-4 border border-surface hover:border-primary/40 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] relative flex flex-col"
             >
                {course.isPopular && (
                  <div className={`absolute top-10 ${isRtl ? 'left-10' : 'right-10'} z-20 px-4 py-2 rounded-xl bg-primary text-background text-[10px] font-black shadow-2xl flex items-center gap-2 transform group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all`}>
                    <Zap size={14} className="fill-current" />
                    {t('elite_pick')}
                  </div>
                )}
                
                {/* Cinema Thumbnail */}
                <div className="aspect-[16/11] bg-black rounded-[2.5rem] relative overflow-hidden flex items-center justify-center shadow-inner">
                   {course.thumbnail ? (
                     <Image 
                       src={course.thumbnail} 
                       alt={course.title} 
                       fill
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                     />
                   ) : (
                     <div className="bg-gradient-to-br from-primary/10 to-transparent absolute inset-0 flex items-center justify-center">
                        <Layout size={64} className="text-primary/20 group-hover:text-primary/50 transition-colors duration-500" />
                     </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                   
                   <div className={`absolute bottom-8 left-8 right-8 flex items-center justify-between z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <div className={`bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                         <span className="text-xl font-black font-mono text-primary">$</span>
                         <span className="text-2xl font-black font-mono tracking-tighter text-glow-primary">{course.price}</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500">
                         <PlayCircle size={28} />
                      </div>
                   </div>
                </div>
                
                {/* Content Bridge */}
                <div className={`p-8 flex flex-col flex-1 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="space-y-3">
                     <div className={`flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest italic ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <Star size={12} className="fill-current" /> {t('rating')}
                     </div>
                     <h2 className="text-3xl font-black italic tracking-tighter line-clamp-2 leading-none group-hover:text-primary transition-colors uppercase">
                        {course.title}
                     </h2>
                  </div>
                  
                  <p className={`text-foreground-muted text-sm line-clamp-2 font-medium leading-relaxed italic border-surface ${isRtl ? 'border-r-2 pr-4 pl-0' : 'border-l-2 pl-4'}`}>
                    {course.description || t('no_desc')}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 py-8 border-y border-surface/50">
                    <CourseMetric icon={<BookOpen />} label={t('metric_courses')} val={course.lessonsCount || 0} isRtl={isRtl} />
                    <CourseMetric icon={<Clock />} label={isRtl ? "المدة" : "Duration"} val={course.duration || "N/A"} isRtl={isRtl} />
                    <CourseMetric icon={<Users />} label={t('metric_students')} val={(course.studentCount || 0).toLocaleString()} isRtl={isRtl} />
                    <CourseMetric icon={<ShieldCheck />} label={t('level')} val={course.level || "Beginner"} isRtl={isRtl} />
                  </div>
                  
                  <Link 
                    href={`/courses/${course.slug}`}
                    className="group/btn relative w-full py-6 rounded-[2rem] bg-primary text-background font-black text-center text-lg overflow-hidden transition-all shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                    <span className="relative z-10">{t('view_details')}</span>
                    {isRtl ? <ArrowLeft size={20} className="relative z-10 transition-transform group-hover/btn:-translate-x-1" /> : <ArrowRight size={20} className="relative z-10 transition-transform group-hover/btn:translate-x-1" />}
                  </Link>
                </div>
             </motion.div>
           ))}
        </AnimatePresence>
      </div>

      {filteredCourses.length === 0 && (
        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           className="py-40 text-center space-y-8"
        >
           <div className="w-24 h-24 bg-surface/50 rounded-full flex items-center justify-center mx-auto text-foreground-muted">
              <Filter size={40} />
           </div>
           <div>
              <h3 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">{t('no_results')}</h3>
              <p className="text-foreground-muted font-bold italic mt-2">{t('no_results_desc')}</p>
           </div>
           <button 
              onClick={() => {setSearchQuery(""); setSelectedCategory("all")}}
              className="px-8 py-4 rounded-2xl bg-surface border border-surface font-black uppercase tracking-widest text-xs hover:border-primary transition-all"
           >
              {t('reset_filters')}
           </button>
        </motion.div>
      )}
    </>
  );
}

function CourseMetric({ icon, label, val, isRtl }: { icon: any, label: string, val: any, isRtl: boolean }) {
   return (
      <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
         <div className="w-9 h-9 rounded-xl bg-surface border border-surface flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
            {icon}
         </div>
         <div className={`space-y-0.5 ${isRtl ? 'text-right' : 'text-left'}`}>
            <p className="text-[10px] font-black uppercase text-foreground-muted leading-none">{label}</p>
            <p className="text-xs font-black tracking-tight leading-none capitalize">{val}</p>
         </div>
      </div>
   );
}
