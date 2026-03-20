"use client";

import { useState, useEffect } from "react";
import { 
  Search, UserCog, UserCheck, ShieldAlert, Phone, Mail, 
  Calendar, Edit3, BookOpen, Clock, X, Save, Plus, Trash2, 
  ExternalLink, Key, Ban, UserCheck2, Filter, ChevronRight
} from "lucide-react";

export default function AdminStudentsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, admin, banned, analysis
  
  // Modal State
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);
  const [editFormData, setEditFormData] = useState<any>({});
  const [enrollingCourseId, setEnrollingCourseId] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, filter]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?query=${searchQuery}`);
      if (res.ok) {
        let data = await res.json();
        
        // Front-end Filtering
        if (filter === "admin") data = data.filter((u: any) => u.role === "admin");
        if (filter === "banned") data = data.filter((u: any) => !u.isActive);
        if (filter === "analysis") data = data.filter((u: any) => u.hasAnalysisAccess);
        
        setUsers(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    const res = await fetch("/api/admin/courses");
    if (res.ok) setCourses(await res.json());
  };

  const fetchUserDetails = async (user: any) => {
    setSelectedUser(user);
    setEditFormData({ ...user });
    setActiveTab("profile");
    
    // Fetch Enrollments
    const res = await fetch(`/api/admin/users/${user._id}/enrollments`);
    if (res.ok) setUserEnrollments(await res.json());
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        userId: selectedUser._id, 
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        role: editFormData.role,
        isActive: editFormData.isActive,
        hasAnalysisAccess: editFormData.hasAnalysisAccess,
        analysisExpiry: editFormData.analysisExpiry
      }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setSelectedUser(updatedUser);
      fetchUsers();
      alert("تم تحديث بيانات المستخدم بنجاح");
    }
  };

  const toggleStatus = async (user: any) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, isActive: !user.isActive }),
    });
    if (res.ok) fetchUsers();
  };

  const handleManualEnroll = async () => {
    if (!enrollingCourseId) return;
    const res = await fetch(`/api/admin/users/${selectedUser._id}/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: enrollingCourseId }),
    });

    if (res.ok) {
      // Refresh enrollments
      const enrollRes = await fetch(`/api/admin/users/${selectedUser._id}/enrollments`);
      if (enrollRes.ok) setUserEnrollments(await enrollRes.json());
      setEnrollingCourseId("");
    } else {
      const err = await res.json();
      alert(err.error || "فشل في تسجيل الطالب");
    }
  };

  const handleRevokeEnroll = async (courseId: string) => {
    if (!confirm("هل أنت متأكد من سحب صلاحية الوصول لهذا الكورس؟")) return;
    const res = await fetch(`/api/admin/users/${selectedUser._id}/enrollments?courseId=${courseId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setUserEnrollments(prev => prev.filter(e => e.course?._id !== courseId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">إدارة <span className="text-primary italic">المستخدمين</span></h1>
          <p className="text-foreground-muted mt-2 font-medium italic">تحكم كامل في الطلاب، المشرفين، وصلاحيات الوصول</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
           <Filter size={18} className="text-foreground-muted ml-2" />
           {["all", "admin", "analysis", "banned"].map((f) => (
             <button 
               key={f}
               onClick={() => setFilter(f)}
               className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${filter === f ? 'bg-primary text-background border-primary shadow-lg' : 'bg-surface/30 border-surface text-foreground-muted hover:border-primary/30'}`}
             >
               {f === 'all' ? 'جميع المستخدمين' : f === 'admin' ? 'المسؤولين' : f === 'analysis' ? 'التحليلات' : 'المحظورين'}
             </button>
           ))}
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" size={24} />
        <input 
          type="text" 
          placeholder="ابحث بالاسم، البريد، أو رقم الهاتف..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface/30 border border-surface rounded-[2.5rem] pr-16 pl-8 py-6 outline-none focus:border-primary transition-all shadow-xl font-bold placeholder:italic placeholder:font-medium"
        />
      </div>

      {loading ? (
        <div className="p-32 text-center animate-pulse text-foreground-muted italic font-black text-2xl">جاري جلب بيانات المنصة...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <div key={user._id} className={`bg-surface/30 rounded-[3rem] border ${user.isActive ? 'border-surface' : 'border-red-500/30'} flex flex-col p-8 hover:border-primary/40 transition-all duration-500 shadow-xl backdrop-blur-sm group relative overflow-hidden`}>
              {!user.isActive && <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>}
              
              <div className="flex justify-between items-start mb-6">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${user.role === 'admin' ? 'bg-primary text-background' : 'bg-surface border border-surface text-primary'}`}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col items-end gap-2">
                   {user.role === 'admin' && <span className="px-3 py-1 bg-primary text-background text-[9px] font-black uppercase rounded-lg shadow-sm">Admin</span>}
                   {user.hasAnalysisAccess && <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[9px] font-black uppercase border border-orange-500/20 rounded-lg">Pro Access</span>}
                   {!user.isActive && <span className="px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase rounded-lg shadow-sm">Banned</span>}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-black tracking-tight">{user.name}</h3>
                <div className="space-y-2 text-sm text-foreground-muted font-bold italic">
                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity"><Mail size={16} className="text-primary" /> {user.email}</div>
                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity"><Phone size={16} className="text-primary" /> {user.phone || "---"}</div>
                  <div className="flex items-center gap-2 opacity-60"><Calendar size={16} /> Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-surface/50 flex gap-4">
                <button 
                  onClick={() => fetchUserDetails(user)}
                  className="flex-1 py-4 bg-surface hover:bg-primary hover:text-background rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <UserCog size={16} /> التحكم الكامل
                </button>
                <button 
                  onClick={() => toggleStatus(user)}
                  title={user.isActive ? "حظر" : "تفعيل"}
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all shadow-sm ${user.isActive ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}
                >
                   {user.isActive ? <Ban size={20} /> : <UserCheck2 size={20} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Control Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-background/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedUser(null)}></div>
           <div className="relative w-full max-w-4xl bg-surface border border-surface rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">
              
              {/* Header */}
              <div className="p-10 border-b border-surface flex justify-between items-center bg-surface/50">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-primary text-background flex items-center justify-center font-black text-3xl shadow-2xl">
                       {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                       <h2 className="text-3xl font-black italic">{selectedUser.name}</h2>
                       <p className="text-foreground-muted font-bold italic">{selectedUser.email}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedUser(null)} className="p-4 bg-surface/50 rounded-full text-foreground-muted hover:text-foreground hover:rotate-90 transition-all">
                    <X size={32} />
                 </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-surface bg-background/30 p-2">
                 {[
                   { id: 'profile', icon: <UserCog size={18} />, label: 'الملف الشخصي' },
                   { id: 'courses', icon: <BookOpen size={18} />, label: 'الكورسات المشتركة' },
                   { id: 'analysis', icon: <Clock size={18} />, label: 'التحليلات (Pro)' },
                 ].map((t) => (
                   <button 
                     key={t.id}
                     onClick={() => setActiveTab(t.id)}
                     className={`flex-1 flex items-center justify-center gap-2 py-4 font-black transition-all rounded-2xl ${activeTab === t.id ? 'bg-primary text-background shadow-lg scale-95' : 'text-foreground-muted hover:text-foreground'}`}
                   >
                      {t.icon} {t.label}
                   </button>
                 ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-10">
                 {activeTab === 'profile' && (
                   <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                      <div className="grid md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-foreground-muted">الاسم الكامل</label>
                            <input value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-background border border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary font-bold" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-foreground-muted">البريد الإلكتروني</label>
                            <input value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} className="w-full bg-background border border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary font-mono text-sm" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-foreground-muted">رقم الهاتف</label>
                            <input value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} className="w-full bg-background border border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary font-bold" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-foreground-muted">الرتبة</label>
                            <select value={editFormData.role} onChange={e => setEditFormData({...editFormData, role: e.target.value})} className="w-full bg-background border border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary font-black">
                               <option value="student">طالب (Student)</option>
                               <option value="admin">مدير (Administrator)</option>
                            </select>
                         </div>
                      </div>
                      <div className="flex justify-end pt-4">
                         <button type="submit" className="px-12 py-5 bg-primary text-background rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3">
                            <Save size={24} /> حفظ التعديلات
                         </button>
                      </div>
                   </form>
                 )}

                 {activeTab === 'courses' && (
                   <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                      <div className="bg-background/40 border border-surface rounded-[2rem] p-8">
                         <h3 className="text-xl font-black mb-6 italic">تسجيل الطالب في كورس <span className="text-primary italic">يدوياً</span></h3>
                         <div className="flex gap-4">
                            <select 
                              value={enrollingCourseId} 
                              onChange={e => setEnrollingCourseId(e.target.value)}
                              className="flex-1 bg-background border border-surface rounded-2xl px-6 py-4 font-black outline-none focus:border-primary"
                            >
                               <option value="">اختر الكورس...</option>
                               {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                            </select>
                            <button 
                              onClick={handleManualEnroll}
                              className="px-8 bg-primary text-background rounded-2xl font-black hover:scale-105 transition-all flex items-center gap-2"
                            >
                               <Plus size={20} /> تسجيل الطالب
                            </button>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-xl font-black italic">الكورسات <span className="text-primary tracking-tighter">المشترك بها فعلياً</span></h3>
                         {userEnrollments.length === 0 ? (
                           <div className="p-12 text-center italic text-foreground-muted border border-dashed border-surface rounded-3xl">لا يوجد اشتراكات حالية</div>
                         ) : (
                           userEnrollments.map(e => (
                             <div key={e._id} className="bg-surface/30 border border-surface rounded-[1.5rem] p-6 flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><BookOpen size={20} /></div>
                                   <div>
                                      <h4 className="font-black italic">{e.course?.title}</h4>
                                      <p className="text-[10px] text-foreground-muted font-bold opacity-70">Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}</p>
                                   </div>
                                </div>
                                <button onClick={() => handleRevokeEnroll(e.course?._id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                                   <Trash2 size={20} />
                                </button>
                             </div>
                           ))
                         )}
                      </div>
                   </div>
                 )}

                 {activeTab === 'analysis' && (
                   <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                      <div className="bg-surface/30 border border-surface rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
                         <div className="space-y-2">
                           <h3 className="text-2xl font-black italic">صلاحية الوصول للتحليلات المدفوعة</h3>
                           <p className="text-foreground-muted font-medium italic">تفعيل اشتراك التحليلات وتحديد تاريخ انتهاء الصلاحية</p>
                         </div>
                         <button 
                           onClick={() => {
                             const newState = !editFormData.hasAnalysisAccess;
                             setEditFormData({...editFormData, hasAnalysisAccess: newState});
                             // Trigger quick patch
                             fetch("/api/admin/users", {
                               method: "PATCH",
                               headers: { "Content-Type": "application/json" },
                               body: JSON.stringify({ userId: selectedUser._id, hasAnalysisAccess: newState }),
                             }).then(() => fetchUsers());
                           }}
                           className={`px-10 py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-xl ${editFormData.hasAnalysisAccess ? 'bg-orange-500 text-white hover:brightness-110' : 'bg-surface border border-surface text-foreground-muted hover:text-foreground'}`}
                         >
                            {editFormData.hasAnalysisAccess ? "إيقاف الصلاحية" : "تفعيل الصلاحية الآن"}
                         </button>
                      </div>

                      {editFormData.hasAnalysisAccess && (
                        <div className="bg-background/20 border border-surface rounded-[2.5rem] p-10 space-y-6">
                           <h4 className="text-lg font-black flex items-center gap-2"><Clock className="text-primary" /> تاريخ ووقت انتهاء الاشتراك</h4>
                           <div className="flex flex-col md:flex-row gap-4">
                              <input 
                                type="datetime-local" 
                                value={(() => {
                                  if (!editFormData.analysisExpiry) return "";
                                  const d = new Date(editFormData.analysisExpiry);
                                  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
                                })()} 
                                onChange={e => {
                                  const newDate = e.target.value;
                                  setEditFormData({...editFormData, analysisExpiry: newDate});
                                }}
                                className="flex-1 bg-background border border-surface rounded-2xl px-6 py-4 font-bold outline-none focus:border-primary text-sm"
                              />
                              <button 
                                onClick={handleUpdateProfile}
                                className="px-10 bg-primary text-background rounded-2xl font-black shadow-lg hover:scale-105 transition-all"
                              >
                                تحديث التاريخ
                              </button>
                           </div>
                           <p className="text-xs text-foreground-muted font-bold italic">سيتم سحب الوصول تلقائياً في نهاية هذا اليوم.</p>
                        </div>
                      )}
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
