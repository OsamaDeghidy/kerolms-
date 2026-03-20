"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save, X, Plus, Trash2, ChevronDown, ChevronUp, Video as VideoIcon } from "lucide-react";
import BunnyVideoUpload from "@/components/admin/BunnyVideoUpload";

export default function EditCoursePage() {
  const router = useRouter();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "content">("info");
  
  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    description: "",
    price: 0,
    level: "beginner",
    thumbnail: "",
    duration: "",
    videoTrailerUrl: "",
    videoType: "bunny",
    externalVideoUrl: "",
    learnings: [""],
    expectedResults: [""],
    targetAudience: [""],
    modules: []
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/admin/courses/${courseId}`);
        if (res.ok) {
          const data = await res.json();
          setFormData(data);
        } else {
          alert("فشل في تحميل بيانات الكورس");
        }
      } catch (err) {
        alert("حدث خطأ في الاتصال");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, value: string, field: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev: any) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  // Module & Lesson Management
  const addModule = () => {
    const newModule = {
      title: "وحدة جديدة",
      order: formData.modules.length + 1,
      lessons: []
    };
    setFormData((prev: any) => ({ ...prev, modules: [...prev.modules, newModule] }));
  };

  const addLesson = (moduleIndex: number) => {
    const newLesson = {
      title: "درس جديد",
      bunnyVideoId: "",
      duration: "",
      order: formData.modules[moduleIndex].lessons.length + 1
    };
    const newModules = [...formData.modules];
    newModules[moduleIndex].lessons.push(newLesson);
    setFormData((prev: any) => ({ ...prev, modules: newModules }));
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: string) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].lessons[lessonIndex][field] = value;
    setFormData((prev: any) => ({ ...prev, modules: newModules }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.refresh();
        alert("تم الحفظ بنجاح!");
      } else {
        alert("حدث خطأ أثناء الحظ");
      }
    } catch (err) {
      alert("خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">جاري التحميل...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">تعديل <span className="text-primary">{formData.title}</span></h1>
          <div className="flex gap-4 mt-4">
             <button 
               onClick={() => setActiveTab("info")}
               className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'info' ? 'bg-primary text-background shadow-lg' : 'bg-surface/30 text-foreground-muted'}`}
             >
                المعلومات الأساسية
             </button>
             <button 
               onClick={() => setActiveTab("content")}
               className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'content' ? 'bg-primary text-background shadow-lg' : 'bg-surface/30 text-foreground-muted'}`}
             >
                المحتوى (الوحدات والدروس)
             </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/admin/courses" className="text-foreground-muted hover:text-foreground font-bold">إلغاء</Link>
           <button 
             onClick={handleSubmit}
             disabled={saving}
             className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-background font-bold hover:bg-primary-hover shadow-xl disabled:opacity-50"
           >
             {saving ? "جاري الحفظ..." : <><Save size={20} /> حفظ التعديلات</>}
           </button>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === "info" ? (
          <div className="grid lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
                {/* General Info */}
                <div className="bg-surface/30 border border-surface rounded-3xl p-8 shadow-sm space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-foreground-muted">عنوان الكورس</label>
                         <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-background border border-surface rounded-xl px-4 py-3 outline-none focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-foreground-muted">الرابط (Slug)</label>
                         <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-background border border-surface rounded-xl px-4 py-3 outline-none focus:border-primary transition-all font-mono" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-sm font-bold text-foreground-muted">الوصف</label>
                         <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-background border border-surface rounded-xl px-4 py-3 outline-none focus:border-primary transition-all" />
                      </div>
                   </div>
                </div>

                {/* Requirements & Results */}
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="bg-surface/30 border border-surface rounded-3xl p-6 space-y-4">
                      <h3 className="font-bold border-b border-surface pb-2">ماذا سيتعلم الطالب؟</h3>
                      {formData.learnings.map((l: string, i: number) => (
                        <input key={i} value={l} onChange={(e) => handleArrayChange(i, e.target.value, "learnings")} className="w-full bg-background border border-surface rounded-lg px-3 py-2 text-sm mb-2" />
                      ))}
                      <button onClick={() => addArrayItem("learnings")} className="text-xs text-primary font-bold">+ إضافة بند</button>
                   </div>
                   <div className="bg-surface/30 border border-surface rounded-3xl p-6 space-y-4">
                      <h3 className="font-bold border-b border-surface pb-2">النتائج المتوقعة</h3>
                      {formData.expectedResults.map((r: string, i: number) => (
                        <input key={i} value={r} onChange={(e) => handleArrayChange(i, e.target.value, "expectedResults")} className="w-full bg-background border border-surface rounded-lg px-3 py-2 text-sm mb-2" />
                      ))}
                      <button onClick={() => addArrayItem("expectedResults")} className="text-xs text-primary font-bold">+ إضافة بند</button>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                {/* Pricing & Level */}
                <div className="bg-surface/30 border border-surface rounded-3xl p-8 shadow-sm space-y-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground-muted">السعر ($)</label>
                      <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-background border border-surface rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-2xl font-black text-primary" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground-muted">المستوى</label>
                      <select name="level" value={formData.level} onChange={handleChange} className="w-full bg-background border border-surface rounded-xl px-4 py-3 outline-none focus:border-primary transition-all font-bold">
                         <option value="beginner">مبتدئ</option>
                         <option value="intermediate">متوسط</option>
                         <option value="advanced">متقدم</option>
                         <option value="pro">خبير</option>
                      </select>
                   </div>
                </div>

                {/* Media */}
                <div className="bg-surface/30 border border-surface rounded-3xl p-8 shadow-sm space-y-6">
                   <div className="space-y-4">
                      <label className="text-sm font-bold text-foreground-muted">بوستر الكورس (Thumbnail)</label>
                      <div className="flex gap-4">
                         <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="flex-1 bg-background border border-surface rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-xs" placeholder="URL..." />
                      </div>
                      {formData.thumbnail && <img src={formData.thumbnail} className="w-full aspect-video object-cover rounded-xl mt-2 border border-surface" />}
                   </div>

                   <div className="border-t border-surface pt-6 space-y-4">
                      <div className="flex gap-4 border-b border-surface pb-4">
                        <button 
                          type="button"
                          onClick={() => setFormData((p: any) => ({ ...p, videoType: 'bunny' }))}
                          className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.videoType === 'bunny' ? 'bg-primary text-background' : 'bg-surface/50 text-foreground-muted'}`}
                        >
                          Bunny Video
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData((p: any) => ({ ...p, videoType: 'external' }))}
                          className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.videoType === 'external' ? 'bg-primary text-background' : 'bg-surface/50 text-foreground-muted'}`}
                        >
                          External URL
                        </button>
                      </div>

                      {formData.videoType === 'bunny' ? (
                        <BunnyVideoUpload 
                          label="فيديو مقدمة الكورس (Trailer)"
                          currentVideoId={formData.videoTrailerUrl}
                          onSuccess={(videoId) => setFormData((prev: any) => ({ ...prev, videoTrailerUrl: videoId }))}
                        />
                      ) : (
                        <div className="space-y-2">
                          <label className="text-sm font-bold block">رابط الفيديو الخارجي (YouTube/Vimeo)</label>
                          <input 
                            type="text" name="externalVideoUrl" value={formData.externalVideoUrl} onChange={handleChange}
                            className="w-full bg-background border border-surface rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                            placeholder="https://..."
                          />
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-6">
             {formData.modules.map((module: any, mIndex: number) => (
                <div key={mIndex} className="bg-surface/20 border border-surface rounded-3xl overflow-hidden">
                   <div className="bg-surface/40 p-6 flex justify-between items-center border-b border-surface">
                      <div className="flex items-center gap-4">
                         <span className="w-8 h-8 rounded-full bg-background border border-surface flex items-center justify-center font-bold text-sm">{mIndex + 1}</span>
                         <input 
                           value={module.title} 
                           onChange={(e) => {
                             const newModules = [...formData.modules];
                             newModules[mIndex].title = e.target.value;
                             setFormData({...formData, modules: newModules});
                           }}
                           className="bg-transparent border-none text-xl font-bold outline-none focus:text-primary transition-colors"
                         />
                      </div>
                      <button onClick={() => addLesson(mIndex)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-all">
                         <Plus size={16} /> إضافة درس للوحدة
                      </button>
                   </div>
                   
                   <div className="p-6 space-y-4">
                      {module.lessons.map((lesson: any, lIndex: number) => (
                        <div key={lIndex} className="bg-background/50 border border-surface rounded-2xl p-6 flex flex-wrap gap-6 items-end group relative transition-all hover:border-primary/30 shadow-sm">
                           <div className="flex-1 space-y-2 min-w-[200px]">
                              <label className="text-[10px] font-black uppercase tracking-wider text-foreground-muted">عنوان الدرس</label>
                              <input value={lesson.title} onChange={(e) => updateLesson(mIndex, lIndex, "title", e.target.value)} className="w-full bg-transparent border-b border-surface focus:border-primary outline-none py-1 font-bold" />
                           </div>
                           <div className="flex-1 space-y-2 min-w-[280px]">
                              <div className="flex gap-2 mb-2 p-1 bg-surface/30 rounded-lg">
                                 <button 
                                   type="button"
                                   onClick={() => updateLesson(mIndex, lIndex, "videoType", "bunny")}
                                   className={`flex-1 py-1 rounded-md text-[10px] font-black transition-all ${lesson.videoType === 'bunny' ? 'bg-primary text-background' : 'text-foreground-muted'}`}
                                 >
                                   Bunny.net
                                 </button>
                                 <button 
                                   type="button"
                                   onClick={() => updateLesson(mIndex, lIndex, "videoType", "external")}
                                   className={`flex-1 py-1 rounded-md text-[10px] font-black transition-all ${lesson.videoType === 'external' ? 'bg-primary text-background' : 'text-foreground-muted'}`}
                                 >
                                   External
                                 </button>
                              </div>

                              {lesson.videoType === 'bunny' ? (
                                <BunnyVideoUpload 
                                  currentVideoId={lesson.bunnyVideoId}
                                  onSuccess={(videoId) => updateLesson(mIndex, lIndex, "bunnyVideoId", videoId)}
                                />
                              ) : (
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-foreground-muted uppercase">External URL</label>
                                   <input 
                                     value={lesson.externalVideoUrl} 
                                     onChange={(e) => updateLesson(mIndex, lIndex, "externalVideoUrl", e.target.value)} 
                                     className="w-full bg-transparent border-b border-surface focus:border-primary outline-none py-1 text-xs"
                                     placeholder="https://youtube.com/..."
                                   />
                                </div>
                              )}
                           </div>
                           <div className="w-32 space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-wider text-foreground-muted">المدة</label>
                              <input value={lesson.duration} onChange={(e) => updateLesson(mIndex, lIndex, "duration", e.target.value)} className="w-full bg-transparent border-b border-surface focus:border-primary outline-none py-1" placeholder="مثلاً 10:00" />
                           </div>
                           <button 
                             onClick={() => {
                               const newModules = [...formData.modules];
                               newModules[mIndex].lessons = newModules[mIndex].lessons.filter((_: any, i: number) => i !== lIndex);
                               setFormData({...formData, modules: newModules});
                             }}
                             className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                           >
                              <Trash2 size={18} />
                           </button>
                        </div>
                      ))}
                      {module.lessons.length === 0 && <div className="text-center py-10 text-foreground-muted italic text-sm">لا يوجد دروس في هذه الوحدة بعد.</div>}
                   </div>
                </div>
             ))}
             <button onClick={addModule} className="w-full py-6 rounded-3xl border-2 border-dashed border-surface text-foreground-muted hover:border-primary/50 hover:text-primary transition-all font-bold flex flex-col items-center gap-2">
                <Plus size={32} />
                إضافة وحدة تعليمية جديدة
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
