"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, Quote, Star, Video, Play, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export default function TestimonialsContent() {
  const t = useTranslations('Testimonials');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [submitted, setSubmitted] = useState(false);
  const isLoggedIn = true; // Student session check

  const testimonials = [
    { id: 1, name: t('list.1.name'), role: t('list.1.role'), content: t('list.1.content'), rating: 5, avatar: "AS" },
    { id: 2, name: t('list.2.name'), role: t('list.2.role'), content: t('list.2.content'), rating: 5, avatar: "SM" },
    { id: 3, name: t('list.3.name'), role: t('list.3.role'), content: t('list.3.content'), rating: 5, avatar: "YA" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <main className="flex-1 pt-32 pb-20 overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center max-w-3xl mx-auto">
             <Link href="/" className="inline-flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors mb-6 group">
               <div className="w-8 h-8 rounded-full border border-surface flex items-center justify-center group-hover:bg-primary/10 transition-all">
                  {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
               </div>
               {t('back_to_home')}
            </Link>
            <h1 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
               {t('title')}
            </h1>
            <p className="text-foreground-muted text-xl font-medium">
               {t('subtitle')}
            </p>
          </div>

          {/* Video Testimonials Slider (Grid for now) */}
          <section className="mb-32">
             <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
                <Video className="text-primary" />
                {t('video_testimonials')}
             </h2>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                   <motion.div 
                     key={i}
                     whileHover={{ y: -10 }}
                     className="aspect-[9/16] bg-surface/50 rounded-[2.5rem] border border-surface overflow-hidden relative group cursor-pointer shadow-2xl"
                   >
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10"></div>
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                         <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={32} className="text-primary fill-primary ml-1" />
                         </div>
                      </div>
                      <div className="absolute bottom-10 left-8 right-8 z-20">
                         <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-background text-sm">
                               {i === 1 ? 'M' : i === 2 ? 'K' : 'A'}
                            </div>
                            <span className="font-black text-lg">{t('video_review_label', { number: i })}</span>
                         </div>
                      </div>
                   </motion.div>
                ))}
             </div>
          </section>

          {/* Text Testimonials */}
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {testimonials.map((test) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={test.id} 
                className="p-10 rounded-[2.5rem] bg-surface/30 border border-surface hover:border-primary/30 transition-all relative overflow-hidden group"
              >
                <Quote className={`absolute top-10 ${isRtl ? 'right-10' : 'left-10'} text-primary/5 w-24 h-24 ${isRtl ? 'rotate-180' : ''}`} />
                
                <div className="flex gap-1 text-primary mb-6 relative z-10">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
                
                <p className="text-foreground-muted text-lg leading-relaxed mb-10 relative z-10 font-medium italic">
                  "{test.content}"
                </p>
                
                <div className="flex items-center gap-4 relative z-10 border-t border-surface/50 pt-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black group-hover:bg-primary group-hover:text-background transition-colors">
                    {test.avatar}
                  </div>
                  <div>
                    <h4 className="font-black text-foreground">{test.name}</h4>
                    <span className="text-sm text-foreground-muted font-bold uppercase tracking-wider">{test.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Feedback Form Section */}
          <section className="max-w-4xl mx-auto">
             <div className="bg-gradient-to-br from-surface to-background border border-surface rounded-[3rem] p-10 lg:p-20 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>
                
                <div className="text-center mb-12 relative z-10">
                   <div className="w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="text-primary" size={32} />
                   </div>
                   <h2 className="text-4xl font-black mb-4">{t('feedback_form_title')}</h2>
                   <p className="text-foreground-muted font-medium max-w-lg mx-auto">{t('feedback_form_desc')}</p>
                </div>

                {!isLoggedIn ? (
                  <div className="text-center p-12 rounded-3xl border border-dashed border-surface">
                     <p className="text-lg font-bold mb-6 italic opacity-70">"{t('login_to_feedback')}"</p>
                     <Link href="/auth/login" className="px-8 py-4 rounded-xl bg-primary text-background font-black hover:bg-primary-hover transition-all">
                        {t('login_now')}
                     </Link>
                  </div>
                ) : (
                  <>
                    {!submitted ? (
                      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                         <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                               <label className="text-sm font-black uppercase tracking-wider opacity-60 ml-2">{t('form_name')}</label>
                               <input 
                                 type="text" 
                                 required
                                 placeholder="John Doe"
                                 className="w-full px-6 py-4 rounded-2xl bg-background/50 border border-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold"
                               />
                            </div>
                            <div className="space-y-3">
                               <label className="text-sm font-black uppercase tracking-wider opacity-60 ml-2">{t('form_rating')}</label>
                               <div className="flex gap-2 p-1.5 px-4 rounded-2xl border border-surface bg-background/50 h-[60px] items-center">
                                  {[1,2,3,4,5].map(s => (
                                    <Star key={s} size={24} className="text-primary cursor-pointer hover:scale-110 transition-transform fill-current" />
                                  ))}
                               </div>
                            </div>
                         </div>
                         <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-wider opacity-60 ml-2">{t('form_comment')}</label>
                            <textarea 
                              required
                              rows={5}
                              className="w-full px-6 py-4 rounded-3xl bg-background/50 border border-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold resize-none"
                              placeholder="..."
                            ></textarea>
                         </div>
                         <button 
                           type="submit"
                           className="w-full py-5 rounded-3xl bg-primary text-background text-lg font-black hover:bg-primary-hover shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                         >
                            <Send size={24} />
                            {t('form_submit')}
                         </button>
                      </form>
                    ) : (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center p-20 space-y-6"
                      >
                         <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-500 shadow-glow">
                            <Star size={44} className="fill-current" />
                         </div>
                         <h3 className="text-3xl font-black">{t('form_success')}</h3>
                         <button onClick={() => setSubmitted(false)} className="text-primary font-bold hover:underline">
                            {t('submit_another')}
                         </button>
                      </motion.div>
                    )}
                  </>
                )}
             </div>
          </section>
        </div>
      </main>
    </>
  );
}
