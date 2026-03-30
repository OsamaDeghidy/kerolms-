"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, Award, BookOpen, Target, Users, TrendingUp, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const t = useTranslations('About');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors mb-12 group">
            <div className="w-8 h-8 rounded-full border border-surface flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
               {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </div>
            {t('back_to_home')}
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            {/* Image Placeholder with Rich Decoration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-surface relative z-10 border border-surface shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-tr from-surface to-background flex items-center justify-center text-primary/20">
                    <span className="text-9xl font-black opacity-10">KERO</span>
                 </div>
                 <div className="absolute bottom-10 left-10 right-10 bg-background/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <h1 className="text-4xl font-bold mb-4">
                  {t.rich('title', {
                    span: (chunks) => <span className="text-primary">{chunks}</span>
                  })}
                </h1>
                    <div className="flex items-center gap-4 mb-2">
                       <div className="flex -space-x-3">
                          {[1,2,3].map(i => (
                             <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-surface flex items-center justify-center text-xs">👤</div>
                          ))}
                       </div>
                       <span className="font-bold text-primary">{t('student_count')}</span>
                    </div>
                    <p className="text-xs text-foreground-muted">{t('student_desc')}</p>
                 </div>
              </div>
              {/* Decoration */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px] -z-10 animate-pulse delay-700"></div>
            </motion.div>
            
            {/* Content Body */}
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h1 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
                  {t('title')}
                </h1>
                <p className="text-xl text-foreground-muted leading-relaxed font-medium whitespace-pre-line">
                  {t('subtitle')}
                </p>
              </motion.div>
              
              <div className="grid gap-8 pt-8">
                <FeatureRow 
                   icon={<Target size={24} />} 
                   title={t('vision_title')} 
                   desc={t('vision_desc')} 
                />
                <FeatureRow 
                   icon={<Award size={24} />} 
                   title={t('experience_title')} 
                   desc={t('experience_desc')} 
                />
                <FeatureRow 
                   icon={<BookOpen size={24} />} 
                   title={t('methodology_title')} 
                   desc={t('methodology_desc')} 
                />
              </div>
            </div>
          </div>

          {/* Stats / Showcase Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
             <StatCard 
               icon={<Users className="text-primary" />} 
               title={t('student_count')} 
               desc={t('student_desc')} 
             />
             <StatCard 
               icon={<Star className="text-yellow-500" />} 
               title={t('success_stories')} 
               desc={t('success_desc')} 
             />
             <StatCard 
               icon={<TrendingUp className="text-green-500" />} 
               title={t('experience_years')} 
               desc={t('mastery_desc')} 
             />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ x: 10 }}
      className="flex gap-6 p-6 rounded-3xl bg-surface/20 border border-surface hover:border-primary/20 transition-all group"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-background transition-all duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-black mb-2">{title}</h3>
        <p className="text-foreground-muted font-medium text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-surface/30 border border-surface text-center space-y-4 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
       <div className="w-16 h-16 rounded-3xl bg-background border border-surface flex items-center justify-center mx-auto shadow-xl">
          {icon}
       </div>
       <h4 className="text-2xl font-black">{title}</h4>
       <p className="text-foreground-muted text-sm">{desc}</p>
    </div>
  )
}
