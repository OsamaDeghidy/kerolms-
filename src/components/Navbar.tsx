"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, User, LogOut, ChevronRight, LayoutDashboard, Settings, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const isRtl = locale === 'ar';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: t('home') },
    { href: "/about", label: t('about') },
    { href: "/courses", label: t('courses') },
    { href: "/analyses", label: t('analyses') },
    { href: "/testimonials", label: t('testimonials') },
    { href: "/contact", label: t('contact') },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-4 bg-background/80 backdrop-blur-xl border-b border-surface shadow-2xl" : "py-8 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group relative z-50">
          <span className="text-2xl font-black italic tracking-tighter uppercase group-hover:scale-105 transition-transform duration-300">
            <span className="text-primary text-glow-primary">KERO</span>
            <span className="text-foreground">TRADE</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] italic">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 relative z-50">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {session ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link 
                href={session.user?.role === "admin" ? "/admin" : "/dashboard"} 
                className="w-10 h-10 rounded-xl bg-surface border border-surface flex items-center justify-center text-primary hover:bg-primary/10 transition-all group"
                title={session.user?.role === "admin" ? "Admin" : "Dashboard"}
              >
                {session.user?.role === "admin" ? <ShieldCheck size={20} /> : <LayoutDashboard size={20} />}
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-10 h-10 rounded-xl bg-surface border border-surface flex items-center justify-center text-foreground-muted hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              href="/auth/login" 
              className="px-6 py-2.5 rounded-xl bg-primary text-background font-black text-xs uppercase italic tracking-widest hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 hidden sm:block"
            >
              {t('login')}
            </Link>
          )}

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground relative"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? <X key="x" size={28} /> : <Menu key="menu" size={28} />}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden bg-background pt-24 px-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    href={link.href}
                    className={`flex items-center justify-between p-5 rounded-2xl bg-surface/30 border border-surface/50 hover:bg-primary/5 hover:border-primary/30 transition-all group ${pathname === link.href ? 'border-primary/50 bg-primary/5' : ''}`}
                  >
                    <span className={`text-xl font-black italic uppercase tracking-widest ${pathname === link.href ? 'text-primary' : 'text-foreground'}`}>
                      {link.label}
                    </span>
                    <ChevronRight size={20} className={`text-primary/30 group-hover:text-primary transition-colors ${isRtl ? 'rotate-180' : ''}`} />
                  </Link>
                </motion.div>
              ))}

              <div className="grid grid-cols-2 gap-4 mt-4">
                 <div className="p-4 rounded-2xl bg-surface/30 border border-surface/50 flex flex-col items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Language</span>
                    <LanguageSwitcher />
                 </div>
                 {session ? (
                   <Link 
                     href={session.user?.role === "admin" ? "/admin" : "/dashboard"}
                     className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex flex-col items-center justify-center gap-3 text-primary"
                   >
                     <span className="text-[10px] font-black uppercase tracking-widest">Panel</span>
                     {session.user?.role === "admin" ? <ShieldCheck size={24} /> : <LayoutDashboard size={24} />}
                   </Link>
                 ) : (
                   <Link 
                     href="/auth/login"
                     className="p-4 rounded-2xl bg-primary flex flex-col items-center justify-center gap-3 text-background shadow-xl shadow-primary/20"
                   >
                     <span className="text-[10px] font-black uppercase tracking-widest">Auth</span>
                     <User size={24} />
                   </Link>
                 )}
              </div>

              {session && (
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="mt-4 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black italic uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <LogOut size={20} /> {t('logout') || 'Logout'}
                </button>
              )}
            </div>

            {/* Decoration */}
            <div className="mt-20 text-center opacity-20 select-none">
               <div className="text-4xl font-black italic tracking-tighter uppercase mb-2">
                  <span className="text-primary">KERO</span> TRADE
               </div>
               <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Grade Intelligence</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link href={href} className={`relative py-2 group overflow-hidden ${isActive ? 'text-primary' : 'text-foreground'}`}>
       <span className="relative z-10 group-hover:text-primary transition-colors duration-300">{children}</span>
       <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-300 ${isActive ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0'}`}></div>
    </Link>
  )
}
