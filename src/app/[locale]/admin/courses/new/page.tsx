"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save, X, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import BunnyVideoUpload from "@/components/admin/BunnyVideoUpload";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    level: "beginner",
    thumbnail: "",
    duration: "",
    videoTrailerUrl: "",
    videoType: "bunny",
    externalVideoUrl: "",
    learnings: [""],
    expectedResults: [""],
    targetAudience: [""]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, value: string, field: "learnings" | "expectedResults" | "targetAudience") => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: "learnings" | "expectedResults" | "targetAudience") => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (index: number, field: "learnings" | "expectedResults" | "targetAudience") => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/courses");
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.message || "حدث خطأ أثناء حفظ الكورس");
      }
    } catch (err) {
      alert("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">إضافة <span className="text-primary">كورس جديد</span></h1>
          <p className="text-foreground-muted text-sm italic">املأ البيانات أدناه لإنشاء الكورس الجديد</p>
        </div>
        <Link 
          href="/admin/courses" 
          className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors font-bold"
        >
          <X size={20} /> إلغاء
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Info Card */}
        <div className="bg-surface/30 border border-surface rounded-3xl p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-surface pb-4">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
            المعلومات الأساسية
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold block">عنوان الكورس</label>
              <input 
                type="text" name="title" required value={formData.title} onChange={handleChange}
                className="w-full bg-background border border-surface rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                placeholder="مثال: احتراف التحليل الموجي"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold block">الرابط (Slug)</label>
              <input 
                type="text" name="slug" required value={formData.slug} onChange={handleChange}
                className="w-full bg-background border border-surface rounded-xl px-4 py-3 focus:border-primary outline-none transition-all font-mono"
                placeholder="wave-trading-masterclass"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold block">الوصف</label>
              <textarea 
                name="description" required value={formData.description} onChange={handleChange} rows={4}
                className="w-full bg-background border border-surface rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                placeholder="اكتب وصفاً تفصيلياً للكورس..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold block">السعر ($)</label>
              <input 
                type="number" name="price" required value={formData.price} onChange={handleChange}
                className="w-full bg-background border border-surface rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold block">المستوى</label>
              <select 
                name="level" value={formData.level} onChange={handleChange}
                className="w-full bg-background border border-surface rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
              >
                <option value="beginner">مبتدئ</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">متقدم</option>
                <option value="pro">خبير</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media & Meta Card */}
        <div className="bg-surface/30 border border-surface rounded-3xl p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-surface pb-4">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
            الوسائط والبيانات
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-sm font-bold block">بوستر الكورس (Poster)</label>
              <input 
                type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange}
                className="w-full bg-background border border-surface rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-xs"
                placeholder="رابط الصورة المباشر..."
              />
              {formData.thumbnail && <img src={formData.thumbnail} className="w-full aspect-video object-cover rounded-xl mt-2 border border-surface" />}
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="flex gap-4 border-b border-surface pb-4">
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, videoType: 'bunny' }))}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.videoType === 'bunny' ? 'bg-primary text-background' : 'bg-surface/50 text-foreground-muted'}`}
                >
                  Bunny.net Video
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, videoType: 'external' }))}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.videoType === 'external' ? 'bg-primary text-background' : 'bg-surface/50 text-foreground-muted'}`}
                >
                  External URL (YouTube)
                </button>
              </div>

              {formData.videoType === 'bunny' ? (
                <BunnyVideoUpload 
                  label="فيديو مقدمة الكورس (Trailer)"
                  currentVideoId={formData.videoTrailerUrl}
                  onSuccess={(videoId) => setFormData(prev => ({ ...prev, videoTrailerUrl: videoId }))}
                />
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-bold block">رابط الفيديو الخارجي (YouTube/Vimeo)</label>
                  <input 
                    type="text" name="externalVideoUrl" value={formData.externalVideoUrl} onChange={handleChange}
                    className="w-full bg-background border border-surface rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold block">مدة الكورس</label>
              <input 
                type="text" name="duration" value={formData.duration} onChange={handleChange}
                className="w-full bg-background border border-surface rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                placeholder="مثال: 15 ساعة"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Lists Section */}
        <div className="grid md:grid-cols-2 gap-8">
           {/* What they will learn */}
           <div className="bg-surface/30 border border-surface rounded-3xl p-6 shadow-lg space-y-4">
              <div className="flex justify-between items-center border-b border-surface pb-3">
                 <h3 className="font-bold">ماذا سيتعلم الطالب؟</h3>
                 <button type="button" onClick={() => addArrayItem("learnings")} className="text-primary hover:bg-primary/10 p-1 rounded-lg transition-colors">
                    <Plus size={20} />
                 </button>
              </div>
              <div className="space-y-3">
                 {formData.learnings.map((item, i) => (
                   <div key={i} className="flex gap-2">
                      <input 
                        type="text" value={item} onChange={(e) => handleArrayChange(i, e.target.value, "learnings")}
                        className="flex-1 bg-background border border-surface rounded-lg px-3 py-2 text-sm outline-none"
                      />
                      <button type="button" onClick={() => removeArrayItem(i, "learnings")} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                         <Trash2 size={16} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>

           {/* Expected Results */}
           <div className="bg-surface/30 border border-surface rounded-3xl p-6 shadow-lg space-y-4">
              <div className="flex justify-between items-center border-b border-surface pb-3">
                 <h3 className="font-bold">النتائج المتوقعة</h3>
                 <button type="button" onClick={() => addArrayItem("expectedResults")} className="text-primary hover:bg-primary/10 p-1 rounded-lg transition-colors">
                    <Plus size={20} />
                 </button>
              </div>
              <div className="space-y-3">
                 {formData.expectedResults.map((item, i) => (
                   <div key={i} className="flex gap-2">
                      <input 
                        type="text" value={item} onChange={(e) => handleArrayChange(i, e.target.value, "expectedResults")}
                        className="flex-1 bg-background border border-surface rounded-lg px-3 py-2 text-sm outline-none"
                      />
                      <button type="button" onClick={() => removeArrayItem(i, "expectedResults")} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                         <Trash2 size={16} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="flex justify-end pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-primary text-background text-lg font-black hover:bg-primary-hover disabled:opacity-50 transition-all shadow-2xl"
          >
            {loading ? "جاري الحفظ..." : <><Save size={24} /> حفظ الكورس</>}
          </button>
        </div>
      </form>
    </div>
  );
}
