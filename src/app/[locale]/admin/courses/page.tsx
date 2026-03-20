"use client";

import { useEffect, useState } from "react";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";
import { Link } from "@/i18n/routing";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكورس نهائياً؟")) return;

    const res = await fetch(`/api/admin/courses/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchCourses();
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-foreground-muted italic">جاري تحميل الكورسات...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight">إدارة <span className="text-primary tracking-tighter">الكورسات</span></h1>
          <p className="text-foreground-muted mt-1 font-medium italic">تحكم في محتوى الأكاديمية والوحدات والدروس</p>
        </div>
        <Link 
          href="/admin/courses/new" 
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-background font-black hover:bg-primary-hover transition-all shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={22} /> إضافة كورس جديد
        </Link>
      </div>

      <div className="bg-surface/30 border border-surface rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-surface/50 border-b border-surface">
              <tr>
                <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-foreground-muted">البوستر</th>
                <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-foreground-muted">عنوان الكورس</th>
                <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-foreground-muted text-center">السعر</th>
                <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-foreground-muted text-center">الطلاب</th>
                <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-foreground-muted text-center">الحالة</th>
                <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-foreground-muted text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface/50">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-foreground-muted italic font-bold">
                    لا يوجد كورسات حالياً. ابدأ بإضافة أول كورس!
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id.toString()} className="hover:bg-primary/5 transition-all group">
                    <td className="px-8 py-6">
                      <div className="w-20 h-12 rounded-xl bg-black/20 overflow-hidden border border-surface shadow-inner transform group-hover:scale-110 transition-transform">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-foreground-muted font-bold uppercase tracking-widest">No Image</div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-lg tracking-tight">{course.title}</div>
                      <div className="text-xs text-foreground-muted font-mono" dir="ltr">{course.slug}</div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-black text-xl text-primary font-mono">${course.price}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="text-sm font-black italic">{course.studentCount}</div>
                      <div className="text-[10px] text-foreground-muted uppercase font-black">Student</div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm border ${course.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {course.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <Link href={`/courses/${course.slug}`} target="_blank" className="p-3 bg-surface border border-surface rounded-xl text-foreground-muted hover:text-primary hover:border-primary/30 transition-all shadow-sm" title="عرض">
                          <Eye size={18} />
                        </Link>
                        <Link href={`/admin/courses/edit/${course._id}`} className="p-3 bg-primary/10 border border-primary/10 rounded-xl text-primary hover:bg-primary hover:text-background transition-all shadow-sm" title="تعديل">
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => deleteCourse(course._id)}
                          className="p-3 bg-red-500/10 border border-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm" 
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
