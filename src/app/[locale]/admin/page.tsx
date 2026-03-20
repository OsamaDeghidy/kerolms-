"use client";

import { useEffect, useState } from "react";
import { Users, DollarSign, BookOpen, Clock, ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getAdminStatsAction } from "@/app/actions/admin";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStatsAction().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="p-20 text-center animate-pulse text-foreground-muted italic">جاري تحميل بيانات لوحة التحكم...</div>
  );

  const statCards = [
    { label: "إجمالي الطلاب", value: stats?.totalStudents || 0, icon: <Users size={24} className="text-blue-500" />, color: "blue" },
    { label: "الإيرادات الكلية", value: `$${stats?.totalRevenue || 0}`, icon: <DollarSign size={24} className="text-green-500" />, color: "green" },
    { label: "جلسات قادمة", value: stats?.upcomingSessionsCount || 0, icon: <Clock size={24} className="text-yellow-500" />, color: "yellow" },
    { label: "إجمالي الكورسات", value: stats?.totalCourses || 0, icon: <BookOpen size={24} className="text-purple-500" />, color: "purple" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">لوحة <span className="text-primary italic">المتابعة</span></h1>
          <p className="text-foreground-muted mt-1 font-medium italic">إحصائيات المنصة الحية والنشاط الأخير</p>
        </div>
        <div className="bg-surface/50 px-6 py-3 rounded-2xl border border-surface flex items-center gap-3">
           <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-sm font-bold">الخادم متصل (Live Mode)</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="group bg-surface/30 p-8 rounded-[2.5rem] border border-surface hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-surface border border-surface flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div>
                <p className="text-foreground-muted text-xs font-black uppercase tracking-widest mb-1 opacity-70">{stat.label}</p>
                <h3 className="text-3xl font-black font-mono">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Users List */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black">أحدث <span className="text-primary">المشتركين</span></h2>
              <button className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors flex items-center gap-1">عرض جميع الطلاب <ArrowUpRight size={14} /></button>
           </div>
           
           <div className="bg-surface/30 rounded-[2.5rem] border border-surface overflow-hidden divide-y divide-surface/50">
              {stats?.recentUsers?.map((user: any) => (
                <div key={user._id} className="p-6 flex items-center justify-between hover:bg-surface/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold">{user.name}</h4>
                      <p className="text-xs text-foreground-muted">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-primary/5 px-2 py-1 rounded-md font-bold text-foreground-muted block mb-1">
                      {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                    {user.role === 'admin' ? (
                      <span className="text-[10px] text-primary font-black flex items-center gap-1 justify-end"><ShieldCheck size={10} /> ADMIN</span>
                    ) : (
                      <span className="text-[10px] text-foreground-muted font-bold uppercase tracking-wider">Student</span>
                    )}
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
           <h2 className="text-2xl font-black px-2">إجراءات <span className="text-primary">سريعة</span></h2>
           <div className="grid gap-4">
              <Link href="/admin/courses" className="bg-primary/10 p-6 rounded-[2rem] border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer group block">
                 <h4 className="font-black text-primary mb-1">تحديث الكورسات</h4>
                 <p className="text-xs text-foreground-muted leading-relaxed">أضف دروساً جديدة أو عدل بيانات الكورسات الحالية من هنا.</p>
              </Link>
              <Link href="/admin/sessions" className="bg-surface/30 p-6 rounded-[2rem] border border-surface hover:border-primary/20 transition-all cursor-pointer block">
                 <h4 className="font-black mb-1">جدولة بث مباشر</h4>
                 <p className="text-xs text-foreground-muted leading-relaxed">حدد موعد الجلسة القادمة لطلاب البريميوم.</p>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
