"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations('Navigation');
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-surface/50 h-24 flex items-center transition-all duration-300">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-3xl font-black italic tracking-tighter uppercase transition-transform hover:scale-105 active:scale-95">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-primary text-glow-primary">KERO</span> 
            <span className="text-foreground transition-colors group-hover:text-primary">TRADE</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] italic">
          <NavLink href="/">{t('home')}</NavLink>
          <NavLink href="/about">{t('about')}</NavLink>
          <NavLink href="/courses">{t('courses')}</NavLink>
          <NavLink href="/analyses">{t('analyses')}</NavLink>
          <NavLink href="/testimonials">{t('testimonials')}</NavLink>
          <NavLink href="/contact">{t('contact')}</NavLink>
        </nav>

        <div className="flex items-center gap-6">
          <div className="scale-90 opacity-80 hover:opacity-100 transition-opacity">
            <LanguageSwitcher />
          </div>
          
          <div className="h-8 w-px bg-surface/50 hidden md:block"></div>

          {status === "authenticated" ? (
            <div className="flex items-center gap-6">
              <Link 
                href={session.user?.role === "admin" ? "/admin" : "/dashboard"} 
                className="px-8 py-3 rounded-2xl bg-primary text-background hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] transition-all text-xs font-black uppercase tracking-widest italic"
              >
                {session.user?.role === "admin" ? t('admin_dashboard') : t('my_account')}
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-foreground-muted hover:text-rose-500 font-black text-[10px] uppercase tracking-widest italic transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="px-8 py-3 rounded-2xl border border-surface bg-surface/30 hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-black uppercase tracking-widest italic text-foreground group">
              <span className="group-hover:text-primary transition-colors">{t('login')}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="relative py-2 group overflow-hidden">
       <span className="relative z-10 hover:text-primary transition-colors duration-300">{children}</span>
       <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
    </Link>
  )
}
