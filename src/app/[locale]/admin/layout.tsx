import { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";
import { BookOpen, Calendar, CreditCard, LayoutDashboard, LogOut, Settings, Users, TrendingUp } from "lucide-react";

export default async function AdminLayout({ 
  children,
  params
}: { 
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  // NOTE: Simple role check, middleware handles the heavy lifting
  if (!session || session.user?.role !== "admin") {
    redirect({ href: "/dashboard", locale });
  }

  const navLinks = [
    { href: "/admin", label: "نظرة عامة", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/students", label: "الطلاب", icon: <Users size={18} /> },
    { href: "/admin/courses", label: "الكورسات", icon: <BookOpen size={18} /> },
    { href: "/admin/sessions", label: "الجدول والمباشر", icon: <Calendar size={18} /> },
    { href: "/admin/analyses", label: "التحليلات", icon: <TrendingUp size={18} /> },
    { href: "/admin/payments", label: "المدفوعات", icon: <CreditCard size={18} /> },
    { href: "/admin/settings", label: "الإعدادات", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-surface/50 border-r border-surface flex flex-col hidden lg:flex">
        <div className="h-16 flex items-center px-6 border-b border-surface shrink-0">
          <Link href="/" className="font-inter font-bold text-xl tracking-tighter text-primary">
            KERO <span className="text-foreground">ADMIN</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-foreground-muted hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  {link.icon} {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-t border-surface shrink-0">
          <Link 
            href="/api/auth/signout" 
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={16} /> تسجيل خروج
          </Link>
        </div>
      </aside>

      {/* Main Content Component */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-surface/50 border-b border-surface flex items-center px-4 justify-between shrink-0">
          <div className="font-inter font-bold text-xl tracking-tighter text-primary">
            KERO <span className="text-foreground">ADMIN</span>
          </div>
          <button className="p-2 bg-surface rounded-md">القائمة</button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
