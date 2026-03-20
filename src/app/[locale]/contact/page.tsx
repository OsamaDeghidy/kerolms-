"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Mail, MessageSquare, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocale } from "next-intl";

export default function ContactPage() {
  const t = useTranslations('Contact');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors mb-12">
            {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            {t('back_to_home')}
          </Link>
          
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-4">
                  {t.rich('title_rich', {
                    span: (chunks) => <span className="text-primary">{chunks}</span>
                  })}
                </h1>
                <p className="text-foreground-muted text-lg">
                  {t('subtitle')}
                </p>
              </div>
              
              <div className="space-y-4">
                <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-surface/30 border border-surface hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <div className="font-bold">{t('whatsapp')}</div>
                    <div className="text-foreground-muted text-sm">{t('whatsapp_desc')}</div>
                  </div>
                </a>
                
                <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-surface/30 border border-surface hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Send size={24} />
                  </div>
                  <div>
                    <div className="font-bold">{t('telegram')}</div>
                    <div className="text-foreground-muted text-sm">{t('telegram_desc')}</div>
                  </div>
                </a>
                
                <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-surface/30 border border-surface hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="font-bold">{t('email')}</div>
                    <div className="text-foreground-muted text-sm">support@kerotrade.com</div>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-surface/30 p-8 rounded-3xl border border-surface">
              <h2 className="text-2xl font-bold mb-6">{t('send_message')}</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-2">{t('form.name')}</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-surface focus:border-primary rounded-xl px-4 py-3 text-foreground outline-none transition-colors"
                    placeholder={t('form.name_placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-2">{t('form.email')}</label>
                  <input 
                    type="email" 
                    className="w-full bg-background border border-surface focus:border-primary rounded-xl px-4 py-3 text-foreground outline-none transition-colors"
                    placeholder="example@mail.com"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-2">{t('form.message')}</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-background border border-surface focus:border-primary rounded-xl px-4 py-3 text-foreground outline-none transition-colors resize-none"
                    placeholder={t('form.message_placeholder')}
                  ></textarea>
                </div>
                <button type="button" className="w-full py-4 rounded-xl bg-primary text-background font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
                  {t('form.send_btn')} <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
