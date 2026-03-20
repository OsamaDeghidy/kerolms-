"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Save, X, Plus, Info, Video } from "lucide-react";

export default function EditAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    isLive: false,
    type: "crypto",
    isActive: true
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/analyses/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            title: data.title || "",
            description: data.description || "",
            videoUrl: data.videoUrl || "",
            isLive: data.isLive || false,
            type: data.type || "crypto",
            isActive: data.isActive ?? true
          });
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch(`/api/admin/analyses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/analyses");
        router.refresh();
      } else {
        alert("حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      alert("خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse italic">جاري تحميل البيانات...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
       <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-black">تعديل <span className="text-primary italic">التحليل</span></h1>
             <p className="text-foreground-muted text-sm italic font-medium">قم بتحديث معلومات التحليل أو تغيير الحالية لمباشر/أرشيف</p>
          </div>
          <Link href="/admin/analyses" className="text-foreground-muted hover:text-foreground font-bold flex items-center gap-2">
             <X size={20} /> إلغاء
          </Link>
       </div>

       <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-surface/30 border border-surface rounded-[2.5rem] p-10 shadow-xl space-y-8">
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                   <label className="text-sm font-black text-foreground-muted uppercase tracking-widest">عنوان التحليل</label>
                   <input 
                     type="text" name="title" required value={formData.title} onChange={handleChange}
                     className="w-full bg-background border border-surface rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-xl font-bold"
                   />
                </div>
                
                <div className="space-y-2">
                   <label className="text-sm font-black text-foreground-muted uppercase tracking-widest">نوع التحليل</label>
                   <select 
                     name="type" value={formData.type} onChange={handleChange}
                     className="w-full bg-background border border-surface rounded-xl px-6 py-4 outline-none focus:border-primary transition-all font-bold"
                   >
                      <option value="crypto">العملات الرقمية (Crypto)</option>
                      <option value="forex">الفوركس (Forex)</option>
                      <option value="stocks">الأسهم (Stocks)</option>
                      <option value="general">عام (General)</option>
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-black text-foreground-muted uppercase tracking-widest">الحالة المباشرة</label>
                   <div className="flex items-center gap-4 h-[60px] px-6 rounded-xl border border-surface bg-background">
                      <input 
                        type="checkbox" name="isLive" checked={formData.isLive} onChange={handleChange}
                        className="w-5 h-5 accent-primary"
                        id="isLive"
                      />
                      <label htmlFor="isLive" className="font-bold cursor-pointer">بث مباشر الآن</label>
                   </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                   <label className="text-sm font-black text-foreground-muted uppercase tracking-widest flex items-center gap-2">
                      <Video size={14} /> رابط الفيديو (Bunny Video ID)
                   </label>
                   <input 
                     type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange}
                     className="w-full bg-background border border-surface rounded-xl px-6 py-4 outline-none focus:border-primary transition-all font-mono"
                   />
                </div>

                <div className="space-y-2 md:col-span-2">
                   <label className="text-sm font-black text-foreground-muted uppercase tracking-widest">توضيح مختصر</label>
                   <textarea 
                     name="description" value={formData.description} onChange={handleChange} rows={4}
                     className="w-full bg-background border border-surface rounded-xl px-6 py-4 outline-none focus:border-primary transition-all font-medium leading-relaxed"
                   />
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-4">
             <button 
               type="submit" 
               disabled={saving}
               className="px-12 py-5 rounded-2xl bg-primary text-background font-black text-lg hover:brightness-110 shadow-2xl shadow-primary/20 transition-all disabled:opacity-50"
             >
                {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
             </button>
          </div>
       </form>
    </div>
  );
}
