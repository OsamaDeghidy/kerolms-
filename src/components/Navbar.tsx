"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations('Navigation');
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-surface">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-bold font-inter tracking-tighter text-primary">
          <Link href="/">
            KERO <span className="text-foreground">TRADE</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link>
          <Link href="/about" className="hover:text-primary transition-colors">{t('about')}</Link>
          <Link href="/courses" className="hover:text-primary transition-colors">{t('courses')}</Link>
          <Link href="/analyses" className="hover:text-primary transition-colors">{t('analyses')}</Link>
          <Link href="/testimonials" className="hover:text-primary transition-colors">{t('testimonials')}</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">{t('contact')}</Link>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <Link 
                href={session.user?.role === "admin" ? "/admin" : "/dashboard"} 
                className="px-6 py-2.5 rounded-full bg-primary text-background hover:bg-primary-hover transition-all text-sm font-bold shadow-lg"
              >
                {session.user?.role === "admin" ? t('admin_dashboard') : t('my_account')}
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-foreground-muted hover:text-red-500 font-bold text-xs"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="px-6 py-2.5 rounded-full border border-surface hover:border-primary transition-colors text-sm font-medium flex items-center justify-center">
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
