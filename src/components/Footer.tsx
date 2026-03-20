"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Twitter, Send, Youtube, Globe } from "lucide-react";

export default function Footer() {
  const t = useTranslations('Navigation');
  const legalT = useTranslations('Legal');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-surface/20 border-t border-surface pt-20 pb-10 mt-20">
       <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
             {/* Brand & Mission */}
             <div className="md:col-span-2 space-y-6">
                <div className="text-2xl font-black tracking-tighter text-primary">
                   KERO <span className="text-foreground">TRADE</span>
                </div>
                <p className="text-foreground-muted leading-relaxed max-w-sm">
                   {t('mission')}
                </p>
                <div className="flex gap-4">
                   <SocialLink icon={<Twitter size={20} />} href="#" />
                   <SocialLink icon={<Send size={20} />} href="#" />
                   <SocialLink icon={<Youtube size={20} />} href="#" />
                </div>
             </div>

             {/* Quick Links */}
             <div className="space-y-6">
                <h4 className="text-lg font-bold">{t('quick_links')}</h4>
                <nav className="flex flex-col gap-4 text-sm text-foreground-muted">
                   <Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link>
                   <Link href="/about" className="hover:text-primary transition-colors">{t('about')}</Link>
                   <Link href="/courses" className="hover:text-primary transition-colors">{t('courses')}</Link>
                   <Link href="/testimonials" className="hover:text-primary transition-colors">{t('testimonials')}</Link>
                </nav>
             </div>

             {/* Legal */}
             <div className="space-y-6">
                <h4 className="text-lg font-bold">{t('legal_header')}</h4>
                <nav className="flex flex-col gap-4 text-sm text-foreground-muted">
                   <Link href="/privacy" className="hover:text-primary transition-colors">{legalT('privacy_title')}</Link>
                   <Link href="/terms" className="hover:text-primary transition-colors">{legalT('terms_title')}</Link>
                   <Link href="/disclaimer" className="hover:text-primary transition-colors">{legalT('disclaimer_title')}</Link>
                </nav>
             </div>
          </div>

          <div className="pt-10 border-t border-surface/50 text-center text-sm text-foreground-muted flex flex-col md:flex-row justify-between items-center gap-6">
             <p>© {year} Kero Trade Academy. {t('rights_reserved')}</p>
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <Globe size={16} className="text-primary" />
                   <span className="uppercase">{locale}</span>
                </div>
                <p>Designed with ❤️ by Kero Team</p>
             </div>
          </div>
       </div>
    </footer>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode, iconName?: string, href: string }) {
   return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-xl bg-surface border border-surface flex items-center justify-center text-foreground-muted hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
      >
         {icon}
      </a>
   )
}
