"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, Video, MessageSquare, Send, Star, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import BunnyPlayer from "@/components/BunnyPlayer";
import { getSecureAction } from "@/app/actions/bunny";

// The 11 student testimonial video IDs provided by the user
const VIDEO_REVIEW_IDS = [
  "5d4eef79-8e6a-4f81-9590-9b6ef1072170",
  "1a32c69e-a0a0-462a-93c3-8febdc3e0767",
  "863b26bc-8444-4337-bbfd-f41b8e06f7d9",
  "8c6789f5-f155-40e3-b781-d428d6a1534d",
  "978d4705-e26f-497f-a483-8ea0f8c74225",
  "6ab3f27f-b927-4ee1-84d0-f9064529abd2",
  "9f7abada-937e-4029-b024-8efb83b4c8ca",
  "bbbfb872-c862-4ba7-aaf0-8ffa8e130636",
  "b19c19ff-8a6c-4dce-84f7-0fe88c1d4943",
  "61af0043-2882-439d-afc9-ad4550a56738",
  "657e3b75-6c7f-4d64-8c3f-dfb5d6f2f2c0"
];

export default function TestimonialsContent() {
  const t = useTranslations('Testimonials');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [submitted, setSubmitted] = useState(false);
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  const [loadingVideos, setLoadingVideos] = useState(true);
  const isLoggedIn = true; // Student session check (placeholder)

  useEffect(() => {
    async function fetchVideoUrls() {
      const urls: Record<string, string> = {};
      try {
        // Fetch secure URLs for all videos in parallel
        await Promise.all(
          VIDEO_REVIEW_IDS.map(async (id) => {
            const url = await getSecureAction(id);
            urls[id] = url;
          })
        );
        setVideoUrls(urls);
      } catch (error) {
        console.error("Error fetching video URLs:", error);
      } finally {
        setLoadingVideos(false);
      }
    }
    fetchVideoUrls();
  }, []);

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

          {/* Video Testimonials Section */}
          <section className="mb-32">
             <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                   <Video className="text-primary" />
                   {t('video_testimonials')}
                </h2>
                <div className="px-4 py-2 rounded-xl bg-primary/5 text-primary text-sm font-black border border-primary/10">
                   {VIDEO_REVIEW_IDS.length} Student Reviews
                </div>
             </div>

             {loadingVideos ? (
               <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-foreground-muted font-bold animate-pulse">Decrypting Student Reviews...</p>
               </div>
             ) : (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {VIDEO_REVIEW_IDS.map((id, index) => (
                     <motion.div 
                       initial={{ opacity: 0, y: 30 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.05 }}
                       viewport={{ once: true }}
                       key={id}
                                               className="aspect-video bg-surface/50 rounded-3xl border border-surface overflow-hidden relative group shadow-2xl"
                     >
                        {videoUrls[id] ? (
                          <div className="w-full h-full relative">
                             <BunnyPlayer src={videoUrls[id]} />
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-red-500/50">
                             Failed to load video
                          </div>
                        )}
                        
                        <div className="absolute top-3 right-3 z-20">
                           <div className="px-2 py-1 rounded-full bg-background/50 backdrop-blur-md border border-surface text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                              Student Review
                           </div>
                        </div>

                        <div className="absolute bottom-4 left-6 right-6 z-20 pointer-events-none">
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center font-black text-primary text-xs">
                                 S{index + 1}
                              </div>
                              <span className="font-black text-base text-white drop-shadow-md">
                                 {t('video_review_label', { number: index + 1 })}
                              </span>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
             )}
          </section>

          {/* Feedback Form Section */}
          <section className="max-w-4xl mx-auto">
             <div className="bg-gradient-to-br from-surface to-background border border-surface rounded-[3rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden">
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
