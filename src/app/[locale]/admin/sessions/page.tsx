"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Plus, Edit, Trash2, Calendar, Clock, 
  Link as LinkIcon, Video, CheckCircle2, 
  AlertCircle, ExternalLink, Users, 
  Search, Filter, ChevronRight, X
} from "lucide-react";

export default function AdminSessionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "live" | "finished">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    meetingUrl: "",
    platform: "zoom",
    isPremium: true,
    courseId: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, coursesRes] = await Promise.all([
        fetch("/api/admin/sessions"),
        fetch("/api/admin/courses")
      ]);
      
      if (sessionsRes.ok) setSessions(await sessionsRes.json());
      if (coursesRes.ok) setCourses(await coursesRes.json());
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (start: string, end: string) => {
    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);

    if (now < startTime) return "upcoming";
    if (now >= startTime && now <= endTime) return "live";
    return "finished";
  };

  const filteredSessions = sessions.filter((s: any) => {
    if (filter === "all") return true;
    return getStatus(s.startTime, s.endTime) === filter;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingSession ? "PUT" : "POST";
    const url = editingSession ? `/api/admin/sessions/${editingSession._id}` : "/api/admin/sessions";
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingSession(null);
        resetForm();
        fetchData();
      }
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      meetingUrl: "",
      platform: "zoom",
      isPremium: true,
      courseId: ""
    });
  };

  const deleteSession = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الجلسة؟")) return;
    const res = await fetch(`/api/admin/sessions/${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  };

  const stats = {
    total: sessions.length,
    live: sessions.filter((s: any) => getStatus(s.startTime, s.endTime) === "live").length,
    upcoming: sessions.filter((s: any) => getStatus(s.startTime, s.endTime) === "upcoming").length
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-surface/20 p-8 rounded-[2rem] border border-surface shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black tracking-tight">إدارة <span className="text-primary italic">الجلسات المباشرة</span></h1>
          <p className="text-foreground-muted mt-2 text-lg font-medium">تحكم في مواعيد البث المباشر وربطها بالكورسات</p>
        </div>
        <button 
          onClick={() => { resetForm(); setEditingSession(null); setShowModal(true); }}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-background font-black text-lg hover:bg-primary-hover transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform" />
          إضافة جلسة جديدة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface/30 border border-surface p-6 rounded-3xl shadow-lg group hover:border-primary/50 transition-all">
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Calendar size={24} /></div>
            <span className="text-4xl font-black text-primary">{stats.total}</span>
          </div>
          <p className="mt-4 font-bold text-foreground-muted">إجمالي الجلسات</p>
        </div>
        <div className="bg-surface/30 border border-surface p-6 rounded-3xl shadow-lg group hover:border-green-500/50 transition-all">
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center relative">
              <Video size={24} />
              {stats.live > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>}
            </div>
            <span className="text-4xl font-black text-green-500">{stats.live}</span>
          </div>
          <p className="mt-4 font-bold text-foreground-muted">مباشر الآن</p>
        </div>
        <div className="bg-surface/30 border border-surface p-6 rounded-3xl shadow-lg group hover:border-yellow-500/50 transition-all">
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center"><Clock size={24} /></div>
            <span className="text-4xl font-black text-yellow-500">{stats.upcoming}</span>
          </div>
          <p className="mt-4 font-bold text-foreground-muted">جلسات قادمة</p>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4 bg-surface/10 p-2 rounded-2xl border border-surface w-fit">
          {[
            { id: "all", label: "الكل", icon: Filter },
            { id: "live", label: "مباشر الآن", icon: Video },
            { id: "upcoming", label: "القادمة", icon: Clock },
            { id: "finished", label: "المنتهية", icon: CheckCircle2 }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${filter === item.id ? 'bg-primary text-background shadow-lg scale-105' : 'text-foreground-muted hover:bg-surface/20'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-32 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground-muted font-bold animate-pulse">جاري تحميل الجلسات...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredSessions.length === 0 ? (
              <div className="bg-surface/20 border-2 border-dashed border-surface rounded-[2.5rem] p-24 text-center space-y-4">
                <div className="w-20 h-20 bg-surface/30 rounded-full flex items-center justify-center mx-auto text-foreground-muted"><Search size={40} /></div>
                <div>
                  <h3 className="text-2xl font-black">لا توجد جلسات</h3>
                  <p className="text-foreground-muted">لم نجد أي جلسات تطابق هذا التصنيف حالياً.</p>
                </div>
              </div>
            ) : (
              filteredSessions.map((session: any) => {
                const status = getStatus(session.startTime, session.endTime);
                return (
                  <div key={session._id} className="relative group overflow-hidden">
                    <div className={`absolute inset-y-0 right-0 w-2 transition-all duration-300 ${status === 'live' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : status === 'upcoming' ? 'bg-yellow-500' : 'bg-foreground-muted/30'}`}></div>
                    <div className="bg-surface/30 border border-surface rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-surface/40 transition-all shadow-xl backdrop-blur-sm group-hover:border-primary/30">
                      
                      <div className="flex items-center gap-8 flex-1">
                        <div className={`w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center font-black overflow-hidden border transition-all ${status === 'live' ? 'bg-green-500/10 text-green-500 border-green-500/20 scale-110 shadow-lg' : 'bg-surface/50 text-foreground-muted border-surface'}`}>
                          <span className="text-3xl tracking-tight">{new Date(session.startTime).getDate()}</span>
                          <span className="text-xs uppercase tracking-widest">{new Date(session.startTime).toLocaleString('ar-EG', { month: 'short' })}</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black">{session.title}</h3>
                            {session.isPremium && (
                              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-background text-[10px] font-black uppercase shadow-lg">Premium Access</span>
                            )}
                            {status === 'live' && (
                              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-[10px] font-black uppercase">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Live Now
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-foreground-muted">
                            <span className="flex items-center gap-2 bg-surface/50 px-3 py-1.5 rounded-xl"><Clock size={16} className="text-primary" /> {new Date(session.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="flex items-center gap-2 bg-surface/50 px-3 py-1.5 rounded-xl uppercase tracking-wider"><Video size={16} className="text-primary" /> {session.platform}</span>
                            {session.courseId && (
                              <span className="flex items-center gap-2 bg-primary/5 text-primary px-3 py-1.5 rounded-xl border border-primary/10">
                                <CheckCircle2 size={16} /> مرتبطة بكورس
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                         {session.meetingUrl && (
                           <a 
                             href={session.meetingUrl} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface hover:bg-surface-hover text-foreground font-bold transition-all border border-surface group/link"
                           >
                             <LinkIcon size={18} className="group-hover/link:rotate-12 transition-transform" />
                             دخول الجلسة
                             <ExternalLink size={14} className="opacity-50" />
                           </a>
                         )}
                         <div className="h-10 w-[1px] bg-surface mx-2 hidden md:block"></div>
                         <button 
                           onClick={() => {
                              setEditingSession(session);
                              setFormData({
                                title: session.title,
                                description: session.description || "",
                                startTime: new Date(session.startTime).toISOString().slice(0, 16),
                                endTime: new Date(session.endTime).toISOString().slice(0, 16),
                                meetingUrl: session.meetingUrl || "",
                                platform: session.platform,
                                isPremium: session.isPremium,
                                courseId: session.courseId || ""
                              });
                              setShowModal(true);
                           }}
                           className="p-4 hover:bg-primary/10 text-foreground-muted hover:text-primary rounded-2xl transition-all"
                           title="تعديل"
                         >
                            <Edit size={22} />
                         </button>
                         <button 
                           onClick={() => deleteSession(session._id)} 
                           className="p-4 hover:bg-red-500/10 text-foreground-muted hover:text-red-500 rounded-2xl transition-all"
                           title="حذف"
                         >
                            <Trash2 size={22} />
                         </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-background/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowModal(false)}></div>
          
          <div className="bg-surface border border-surface w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 z-10">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-8 left-8 p-3 bg-surface/50 hover:bg-surface rounded-2xl text-foreground-muted hover:text-foreground transition-all"
            >
              <X size={24} />
            </button>

            <div className="mb-10 space-y-2">
              <h2 className="text-3xl font-black">{editingSession ? "تعديل بيانات الجلسة" : "إضافة جلسة مباشرة"}</h2>
              <p className="text-foreground-muted font-medium italic">املأ البيانات بدقة ليظهر الموعد للطلاب بشكل صحيح</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-right">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-foreground-muted">عنوان الجلسة</label>
                <input 
                  type="text" required placeholder="مثلاً: المراجعة الأسبوعية للتحليل الموجي"
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  className="w-full bg-background/50 border border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-lg font-bold" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-foreground-muted">وقت البدء</label>
                  <input 
                    type="datetime-local" required 
                    value={formData.startTime} 
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})} 
                    className="w-full bg-background/50 border border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-mono [color-scheme:dark]" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-foreground-muted">وقت الانتهاء</label>
                  <input 
                    type="datetime-local" required 
                    value={formData.endTime} 
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})} 
                    className="w-full bg-background/50 border border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-mono [color-scheme:dark]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-black uppercase tracking-widest text-foreground-muted">المنصة</label>
                   <select 
                     value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value})} 
                     className="w-full bg-background/50 border border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-bold appearance-none"
                   >
                     <option value="zoom">Zoom Meeting</option>
                     <option value="google_meet">Google Meet</option>
                     <option value="youtube_live">YouTube Live</option>
                     <option value="other">منصة أخرى</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-black uppercase tracking-widest text-foreground-muted">ربط بكورس (اختياري)</label>
                   <select 
                     value={formData.courseId} onChange={(e) => setFormData({...formData, courseId: e.target.value})} 
                     className="w-full bg-background/50 border border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-bold appearance-none"
                   >
                     <option value="">عام (لا يوجد ربط)</option>
                     {courses.map((c: any) => (
                       <option key={c._id} value={c._id}>{c.title}</option>
                     ))}
                   </select>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-foreground-muted">رابط الاجتماع / البث</label>
                <div className="relative group">
                  <LinkIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="url" placeholder="https://zoom.us/j/..."
                    value={formData.meetingUrl} onChange={(e) => setFormData({...formData, meetingUrl: e.target.value})} 
                    className="w-full bg-background/50 border border-surface rounded-2xl pr-14 pl-6 py-4 outline-none focus:border-primary transition-all font-mono text-sm" 
                  />
                </div>
              </div>

              <div className="bg-surface/30 p-6 rounded-2xl border border-surface flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">جلسة بريميوم</h4>
                      <p className="text-xs text-foreground-muted">عند التفعيل، سيظهر الموعد فقط للطلاب المشتركين.</p>
                    </div>
                 </div>
                 <button 
                  type="button"
                  onClick={() => setFormData({...formData, isPremium: !formData.isPremium})}
                  className={`w-14 h-8 rounded-full p-1 transition-all ${formData.isPremium ? 'bg-primary' : 'bg-surface/50'}`}
                 >
                    <div className={`w-6 h-6 rounded-full bg-background shadow-lg transition-all ${formData.isPremium ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-surface hover:bg-surface-hover text-foreground font-black text-lg transition-all border border-surface"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-4 rounded-2xl bg-primary text-background font-black text-lg hover:bg-primary-hover transition-all shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95"
                >
                   {editingSession ? "حفظ التغييرات" : "تأكيد الإضافة للجدول"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
