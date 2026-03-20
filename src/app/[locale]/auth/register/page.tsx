"use client";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Lock, Mail, User, Phone, Loader2, Sparkles, Building2 } from "lucide-react";
import { useLocale } from "next-intl";
import Auth3DScene from "@/components/auth/Auth3DScene";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || t('registration_error'));
      } else {
         router.push("/auth/login?registered=true");
      }
    } catch (err) {
      setError(t('connection_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Auth3DScene />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-12 left-12"
      >
        <Link href="/" className="group flex items-center gap-3 bg-surface/20 backdrop-blur-xl px-8 py-4 rounded-2xl border border-surface hover:border-primary/30 transition-all shadow-2xl">
           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
           </div>
           <span className="font-black italic text-sm tracking-widest text-foreground-muted group-hover:text-foreground transition-colors uppercase">
              {t('back_to_home')}
           </span>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="w-full max-w-xl relative py-12"
      >
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-pink-500/20 to-blue-500/20 rounded-[3.5rem] blur-3xl opacity-50"></div>
        
        <div className="relative bg-surface/30 backdrop-blur-[50px] p-12 lg:p-16 rounded-[3.5rem] border border-surface shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-b-4 border-b-primary/30 overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10 text-center mb-10 space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-b-2 border-primary/20 shadow-inner">
               <User className="text-primary w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter leading-none">
              {t.rich('register_title', {
                span: (chunks) => <span className="text-primary underline decoration-primary/20 underline-offset-8 italic">{chunks}</span>
              })}
            </h1>
            <p className="text-foreground-muted text-lg font-medium italic tracking-wide">{t('register_subtitle')}</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-3xl text-sm font-bold flex items-center gap-4 border-l-4 border-l-red-500 shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">!</div>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div className="space-y-6">
              <div className="space-y-3 group">
                <label className="text-xs font-black uppercase text-foreground-muted tracking-[0.3em] group-focus-within:text-primary transition-colors block ml-2">
                   {t('full_name')}
                </label>
                <div className="relative">
                  <User className={`absolute ${isRtl ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-all duration-500`} size={22} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={`w-full bg-background/40 border border-surface focus:border-primary/50 focus:bg-background/60 rounded-2xl py-6 text-xl text-foreground font-black outline-none transition-all duration-500 shadow-sm backdrop-blur-md ${isRtl ? 'pr-16 pl-6' : 'pl-16 pr-6'}`}
                    placeholder={t('name_placeholder')}
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-xs font-black uppercase text-foreground-muted tracking-[0.3em] group-focus-within:text-primary transition-colors block ml-2">
                   {t('email')}
                </label>
                <div className="relative">
                  <Mail className={`absolute ${isRtl ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-all duration-500`} size={22} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full bg-background/40 border border-surface focus:border-primary/50 focus:bg-background/60 rounded-2xl py-6 text-xl text-foreground font-black outline-none transition-all duration-500 shadow-sm backdrop-blur-md ${isRtl ? 'pr-16 pl-6' : 'pl-16 pr-6'}`}
                    placeholder="mail@kero.com"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-xs font-black uppercase text-foreground-muted tracking-[0.3em] group-focus-within:text-primary transition-colors block ml-2">
                   {t('phone')}
                </label>
                <div className="relative">
                  <Phone className={`absolute ${isRtl ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-all duration-500`} size={22} />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className={`w-full bg-background/40 border border-surface focus:border-primary/50 focus:bg-background/60 rounded-2xl py-6 text-xl text-foreground font-black outline-none transition-all duration-500 shadow-sm backdrop-blur-md ${isRtl ? 'pr-16 pl-6' : 'pl-16 pr-6'}`}
                    placeholder={t('phone_placeholder')}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-xs font-black uppercase text-foreground-muted tracking-[0.3em] group-focus-within:text-primary transition-colors block ml-2">
                   {t('password')}
                </label>
                <div className="relative">
                  <Lock className={`absolute ${isRtl ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-all duration-500`} size={22} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className={`w-full bg-background/40 border border-surface focus:border-primary/50 focus:bg-background/60 rounded-2xl py-6 text-xl text-foreground font-black outline-none transition-all duration-500 shadow-sm backdrop-blur-md ${isRtl ? 'pr-16 pl-6' : 'pl-16 pr-6'}`}
                    placeholder="••••••••"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-6 mt-4 rounded-2xl bg-primary text-background text-2xl font-black hover:bg-primary-hover shadow-[0_20px_50px_-10px_rgba(var(--primary-rgb),0.5)] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" /> {t('registering')}</>
              ) : (
                <>{t('register_button')} <Sparkles size={20} /></>
              )}
            </button>
            
            <div className="text-center pt-8 border-t border-surface/50">
              <p className="text-sm font-medium text-foreground-muted italic tracking-wide">
                {t('have_account')} 
                <Link href="/auth/login" className="text-primary font-black hover:text-white transition-colors ml-2 underline decoration-primary/30 underline-offset-4">
                   {t('login')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
