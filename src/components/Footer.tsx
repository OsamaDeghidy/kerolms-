import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Twitter, Send, Youtube, Globe } from "lucide-react";

export default async function Footer() {
  const t = await getTranslations('Navigation');
  const legalT = await getTranslations('Legal');
  const locale = await getLocale();
  const isRtl = locale === 'ar';
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-surface/20 border-t border-surface pt-24 pb-10 mt-20 relative overflow-hidden">
       {/* Background Glow */}
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] -z-10 rounded-full"></div>

       <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
             {/* Brand & Mission */}
             <div className="md:col-span-2 space-y-8">
                <div className="text-3xl font-black tracking-tighter italic uppercase group cursor-default">
                   <span className="text-primary text-glow-primary">KERO</span> <span className="text-foreground">TRADE</span>
                </div>
                <p className={`text-foreground-muted leading-relaxed max-w-sm font-medium italic ${isRtl ? 'border-r-2 pr-6' : 'border-l-2 pl-6'} border-surface`}>
                   {t('mission')}
                </p>
                <div className="flex gap-4">
                   <SocialLink icon={<Twitter size={20} />} href="#" />
                   <SocialLink icon={<Send size={20} />} href="#" />
                   <SocialLink icon={<Youtube size={20} />} href="#" />
                </div>
             </div>

             {/* Quick Links */}
             <div className="space-y-8">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary italic">{t('quick_links')}</h4>
                <nav className="flex flex-col gap-5 text-sm font-bold italic">
                   <FooterLink href="/">{t('home')}</FooterLink>
                   <FooterLink href="/about">{t('about')}</FooterLink>
                   <FooterLink href="/courses">{t('courses')}</FooterLink>
                   <FooterLink href="/testimonials">{t('testimonials')}</FooterLink>
                </nav>
             </div>

             {/* Legal */}
             <div className="space-y-8">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary italic">{t('legal_header')}</h4>
                <nav className="flex flex-col gap-5 text-sm font-bold italic">
                   <FooterLink href="/privacy">{legalT('privacy_title')}</FooterLink>
                   <FooterLink href="/terms">{legalT('terms_title')}</FooterLink>
                   <FooterLink href="/disclaimer">{legalT('disclaimer_title')}</FooterLink>
                </nav>
             </div>
          </div>

          <div className="pt-10 border-t border-surface/50 text-center text-xs text-foreground-muted flex flex-col md:flex-row justify-between items-center gap-8">
             <p className="font-bold italic">© {year} Kero Trade Academy. {t('rights_reserved')}</p>
             <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/50 border border-surface">
                   <Globe size={14} className="text-primary" />
                   <span className="uppercase font-black">{locale}</span>
                </div>
                <p className="font-bold italic opacity-60">Architected by <span className="text-primary">Kero Trade Team</span></p>
             </div>
          </div>
       </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
   return (
      <Link href={href} className="text-foreground-muted hover:text-primary hover:translate-x-1 transition-all duration-300 w-fit">
         {children}
      </Link>
   )
}

function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
   return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-2xl bg-surface border border-surface flex items-center justify-center text-foreground-muted hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all shadow-lg active:scale-90"
      >
         {icon}
      </a>
   )
}
