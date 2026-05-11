"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, MessageSquare, Send, Youtube, Video, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocale } from "next-intl";

export default function ContactPage() {
  const t = useTranslations('Contact');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const socialLinks = [
    {
      title: t('whatsapp_group'),
      desc: t('whatsapp_group_desc'),
      icon: <MessageSquare size={24} />,
      color: "text-green-500",
      bg: "bg-green-500/10",
      href: t('whatsapp_group_link')
    },
    {
      title: t('whatsapp_personal'),
      desc: t('whatsapp_personal_desc'),
      icon: <MessageSquare size={24} />,
      color: "text-green-400",
      bg: "bg-green-400/10",
      href: "https://wa.me/971502036022"
    },
    {
      title: t('telegram_personal'),
      desc: t('telegram_personal_desc'),
      icon: <Send size={24} />,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      href: "https://t.me/Kirellos_Amin"
    },
    {
      title: t('telegram_channel'),
      desc: t('telegram_channel_desc'),
      icon: <Send size={24} />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "https://t.me/kerotrade"
    },
    {
      title: t('tiktok'),
      desc: "@kerotrade",
      icon: <Video size={24} />,
      color: "text-foreground",
      bg: "bg-foreground/5",
      href: t('tiktok_link')
    },
    {
      title: t('tiktok') + " (2)",
      desc: "@kero1trade",
      icon: <Video size={24} />,
      color: "text-foreground",
      bg: "bg-foreground/5",
      href: t('tiktok_link_2')
    },
    {
      title: t('youtube'),
      desc: "Kero Trade",
      icon: <Youtube size={24} />,
      color: "text-red-500",
      bg: "bg-red-500/10",
      href: t('youtube_link')
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors mb-12">
            {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            {t('back_to_home')}
          </Link>
          
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 lg:gap-20">
            <div className="space-y-10">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                  {t.rich('title_rich', {
                    span: (chunks) => <span className="text-primary">{chunks}</span>
                  })}
                </h1>
                <p className="text-foreground-muted text-lg max-w-xl">
                  {t('subtitle')}
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 rounded-2xl bg-surface/30 border border-surface hover:border-primary/50 transition-all hover:bg-surface/50 group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${link.bg} flex items-center justify-center ${link.color} group-hover:scale-110 transition-transform shadow-sm`}>
                      {link.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-0.5">{link.title}</div>
                      <div className="text-foreground-muted text-xs">{link.desc}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Warning Box */}
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 flex gap-5">
                <div className="text-red-500 shrink-0">
                  <ShieldAlert size={32} />
                </div>
                <div>
                  <h3 className="text-red-500 font-bold mb-2 text-lg flex items-center gap-2">
                    {t('warning_title')}
                  </h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">
                    {t('warning_desc')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-surface/30 p-8 lg:p-10 rounded-[2rem] border border-surface h-fit lg:sticky lg:top-32 shadow-xl shadow-black/5">
              <h2 className="text-2xl font-bold mb-8">{t('send_message')}</h2>
              <form className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground-muted px-1">{t('form.name')}</label>
                  <input 
                    type="text" 
                    className="w-full bg-background/50 border border-surface focus:border-primary rounded-xl px-4 py-3.5 text-foreground outline-none transition-all focus:ring-4 ring-primary/5"
                    placeholder={t('form.name_placeholder')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground-muted px-1">{t('form.email')}</label>
                  <input 
                    type="email" 
                    className="w-full bg-background/50 border border-surface focus:border-primary rounded-xl px-4 py-3.5 text-foreground outline-none transition-all focus:ring-4 ring-primary/5"
                    placeholder="example@mail.com"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground-muted px-1">{t('form.message')}</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-background/50 border border-surface focus:border-primary rounded-xl px-4 py-3.5 text-foreground outline-none transition-all focus:ring-4 ring-primary/5 resize-none"
                    placeholder={t('form.message_placeholder')}
                  ></textarea>
                </div>
                <button type="button" className="w-full py-4 mt-2 rounded-xl bg-primary text-background font-bold hover:bg-primary-hover transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
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
