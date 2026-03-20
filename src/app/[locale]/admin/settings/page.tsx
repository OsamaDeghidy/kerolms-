"use client";

import { useEffect, useState } from "react";
import { 
  Save, Settings, Link as LinkIcon, 
  Smartphone, CreditCard, Info, Globe, 
  ShieldCheck, Share2, Wallet, Building2, 
  Phone, AlertCircle, CheckCircle, Loader2,
  Lock, Layout, Type, Palette
} from "lucide-react";

type SettingTab = "general" | "financial" | "social" | "system";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "Kero Trade",
    seoTitle: "",
    seoDescription: "",
    contactEmail: "",
    contactPhone: "",
    telegramUrl: "",
    whatsappUrl: "",
    youtubeUrl: "",
    facebookUrl: "",
    usdtAddress: "",
    bankDetails: "",
    vodafoneCash: "",
    maintenanceMode: false,
    footerText: "Copyright © 2026 Kero Trade. All Rights Reserved."
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setShowSuccess(true);
        setHasChanges(false);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-40 text-center space-y-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-foreground-muted font-black italic animate-pulse tracking-widest uppercase">Initialising Control Center...</p>
    </div>
  );

  const tabs: { id: SettingTab; label: string; icon: any; color: string }[] = [
    { id: "general", label: "أساسيات المنصة", icon: Globe, color: "text-blue-500" },
    { id: "financial", label: "المالية والدفع", icon: CreditCard, color: "text-green-500" },
    { id: "social", label: "روابط التواصل", icon: Share2, color: "text-pink-500" },
    { id: "system", label: "تفضيلات النظام", icon: ShieldCheck, color: "text-orange-500" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-surface/20 p-12 rounded-[3.5rem] border border-surface shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl font-black italic tracking-tight leading-tight flex items-center gap-4">
             <Settings className="text-primary w-12 h-12" /> مركز <span className="text-primary underline decoration-primary/30 underline-offset-8">التحكم</span>
          </h1>
          <p className="text-foreground-muted text-xl font-medium max-w-lg">إدارة الشؤون التقنية، المالية، وإعدادات الظهور لمحركات البحث</p>
        </div>
        
        <div className="flex items-center gap-3 bg-surface/40 p-3 rounded-[2.5rem] border border-surface shadow-lg backdrop-blur-md">
           {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all duration-500 ${activeTab === tab.id ? 'bg-primary text-background shadow-2xl scale-105' : 'text-foreground-muted hover:bg-surface/50 hover:text-foreground'}`}
              >
                <tab.icon size={20} className={activeTab === tab.id ? "text-background" : tab.color} />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
           ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-surface/30 border border-surface rounded-[3.5rem] p-12 shadow-3xl backdrop-blur-xl space-y-12 min-h-[500px]">
          
          {/* TAB: General */}
          {activeTab === "general" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <h2 className="text-2xl font-black italic flex items-center gap-3 border-b border-surface pb-6">
                       <Type className="text-blue-500" /> الهوية البصرية
                    </h2>
                    <div className="space-y-6">
                       <div className="space-y-2 group">
                          <label className="text-xs font-black uppercase text-foreground-muted tracking-[0.2em] group-focus-within:text-primary transition-colors">اسم الموقع (Branding)</label>
                          <input 
                            type="text" value={settings.siteName} onChange={e => handleChange('siteName', e.target.value)}
                            className="w-full bg-background/50 border border-surface rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all font-black text-lg shadow-sm"
                          />
                       </div>
                       <div className="space-y-2 group">
                          <label className="text-xs font-black uppercase text-foreground-muted tracking-[0.2em] group-focus-within:text-primary transition-colors">البريد الرسمي</label>
                          <input 
                            type="email" value={settings.contactEmail} onChange={e => handleChange('contactEmail', e.target.value)}
                            className="w-full bg-background/50 border border-surface rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all font-mono text-sm"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h2 className="text-2xl font-black italic flex items-center gap-3 border-b border-surface pb-6">
                       <Globe className="text-green-500" /> محركات البحث (SEO)
                    </h2>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-foreground-muted tracking-[0.2em]">عنوان الموقع في جوجل</label>
                          <input 
                            type="text" value={settings.seoTitle} onChange={e => handleChange('seoTitle', e.target.value)}
                            className="w-full bg-background/50 border border-surface rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all font-bold"
                            placeholder="Kero Trade - أفضل منصة لتعلم التداول"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-foreground-muted tracking-[0.2em]">وصف الموقع (Meta Description)</label>
                          <textarea 
                            value={settings.seoDescription} onChange={e => handleChange('seoDescription', e.target.value)}
                            className="w-full bg-background/50 border border-surface rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all font-medium h-32 resize-none"
                            placeholder="وصف مختصر يظهر للطلاب في نتائج البحث..."
                          />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* TAB: Financial */}
          {activeTab === "financial" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-surface/40 p-10 rounded-[2.5rem] border border-surface shadow-xl space-y-6 group hover:border-green-500/50 transition-all">
                     <div className="w-16 h-16 rounded-[1.5rem] bg-green-500/10 text-green-500 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                        <Wallet size={32} />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-xl font-black italic">USDT (TRC20)</h3>
                        <textarea 
                          value={settings.usdtAddress} onChange={e => handleChange('usdtAddress', e.target.value)}
                          className="w-full bg-background border border-surface rounded-2xl p-6 focus:border-green-500 outline-none transition-all font-mono text-xs h-40 resize-none shadow-sm"
                          placeholder="أدخل عنوان المحفظة هنا..."
                        />
                     </div>
                  </div>

                  <div className="bg-surface/40 p-10 rounded-[2.5rem] border border-surface shadow-xl space-y-6 group hover:border-blue-500/50 transition-all">
                     <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                        <Building2 size={32} />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-xl font-black italic">البنك / إنستاباي</h3>
                        <textarea 
                          value={settings.bankDetails} onChange={e => handleChange('bankDetails', e.target.value)}
                          className="w-full bg-background border border-surface rounded-2xl p-6 focus:border-blue-500 outline-none transition-all font-bold text-xs h-40 resize-none shadow-sm"
                          placeholder="أدخل بيانات الحساب الرسمي..."
                        />
                     </div>
                  </div>

                  <div className="bg-surface/40 p-10 rounded-[2.5rem] border border-surface shadow-xl space-y-6 group hover:border-red-500/50 transition-all">
                     <div className="w-16 h-16 rounded-[1.5rem] bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                        <Phone size={32} />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-xl font-black italic">فودافون كاش</h3>
                        <textarea 
                          value={settings.vodafoneCash} onChange={e => handleChange('vodafoneCash', e.target.value)}
                          className="w-full bg-background border border-surface rounded-2xl p-6 focus:border-red-500 outline-none transition-all font-bold text-xs h-40 resize-none shadow-sm"
                          placeholder="أدخل أرقام التحويل هنا..."
                        />
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: Social */}
          {activeTab === "social" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="grid md:grid-cols-2 gap-12">
                  {[
                    { key: 'whatsappUrl', label: 'رابط واتساب', icon: Phone, color: 'text-green-500' },
                    { key: 'telegramUrl', label: 'رابط تيليجرام', icon: Share2, color: 'text-blue-500' },
                    { key: 'youtubeUrl', label: 'رابط يوتيوب', icon: Palette, color: 'text-red-500' },
                    { key: 'facebookUrl', label: 'رابط فيسبوك', icon: Globe, color: 'text-blue-600' }
                  ].map((item) => (
                    <div key={item.key} className="space-y-4 bg-surface/20 p-8 rounded-[2rem] border border-surface">
                       <label className="text-xs font-black uppercase text-foreground-muted tracking-widest flex items-center gap-2">
                          <item.icon size={16} className={item.color} /> {item.label}
                       </label>
                       <input 
                         type="text" value={(settings as any)[item.key]} onChange={e => handleChange(item.key, e.target.value)}
                         className="w-full bg-background border border-surface rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all font-mono text-sm"
                         placeholder="https://..."
                       />
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB: System */}
          {activeTab === "system" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1 space-y-8 bg-surface/20 p-10 rounded-[3rem] border border-surface backdrop-blur-md">
                     <h3 className="text-2xl font-black italic flex items-center gap-3">
                        <AlertCircle className="text-orange-500" /> وضع الصيانة
                     </h3>
                     <div className="flex items-center justify-between p-8 bg-background/50 rounded-[2rem] border border-surface">
                        <div>
                           <p className="font-black text-lg">تفعيل وضع الصيانة</p>
                           <p className="text-sm text-foreground-muted italic">سيتم عرض صفحة "تحت الصيانة" للطلاب ولن يتمكن أحد من الدخول للموقع سوى المشرفين.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                          className={`w-20 h-10 rounded-full p-1 transition-all duration-500 relative ${settings.maintenanceMode ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'bg-surface'}`}
                        >
                           <div className={`w-8 h-8 rounded-full bg-white shadow-xl transition-all duration-500 ${settings.maintenanceMode ? 'translate-x-10' : 'translate-x-0'}`}></div>
                        </button>
                     </div>
                  </div>

                  <div className="flex-1 space-y-8 bg-surface/20 p-10 rounded-[3rem] border border-surface backdrop-blur-md">
                     <h3 className="text-2xl font-black italic flex items-center gap-3">
                        <Layout className="text-primary" /> التذييل (Footer)
                     </h3>
                     <div className="space-y-4">
                        <label className="text-xs font-black uppercase text-foreground-muted tracking-widest">نص حقوق الملكية</label>
                        <textarea 
                          value={settings.footerText} onChange={e => handleChange('footerText', e.target.value)}
                          className="w-full bg-background border border-surface rounded-2xl p-6 focus:border-primary outline-none transition-all font-bold text-sm h-32 resize-none shadow-sm"
                          placeholder="Copyright © 2026..."
                        />
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* Floating Save Indicator */}
        <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${hasChanges ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'}`}>
           <div className="bg-background/80 backdrop-blur-3xl border border-primary/30 p-4 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(var(--primary-rgb),0.4)] flex items-center gap-6 px-10 border-b-4 border-b-primary">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                    <AlertCircle className="text-primary" size={20} />
                 </div>
                 <p className="text-sm font-black italic whitespace-nowrap">لديك تغييرات غير محفوظة!</p>
              </div>
              <button 
                type="submit"
                disabled={saving}
                className="bg-primary text-background px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-primary-hover shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                {saving ? (
                  <><Loader2 className="animate-spin" size={18} /> جاري الحفظ...</>
                ) : (
                  <><Save size={18} /> حفظ التغييرات الآن</>
                )}
              </button>
           </div>
        </div>
      </form>

      {/* Persistence Floating Status */}
      {!hasChanges && !saving && (
        <div className="fixed bottom-12 right-12 z-40 animate-in slide-in-from-right-10 duration-700">
           <div className="bg-surface/60 backdrop-blur-xl border border-surface p-4 px-8 rounded-full flex items-center gap-3 shadow-2xl">
              <CheckCircle className="text-green-500" size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">System Synced & Secure</span>
           </div>
        </div>
      )}

      {/* Full Page Success Toast */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-md"></div>
           <div className="relative bg-surface p-12 rounded-[3.5rem] border border-primary shadow-3xl text-center space-y-6 scale-110 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-primary/20">
                 <CheckCircle size={48} className="animate-bounce" />
              </div>
              <h2 className="text-4xl font-black italic">تم التحديث بنجاح!</h2>
              <p className="text-foreground-muted text-xl font-medium italic">لقد تم حفظ جميع تعديلات المنصة في قاعدة البيانات.</p>
              <button type="button" onClick={() => setShowSuccess(false)} className="px-12 py-4 bg-primary text-background rounded-2xl font-black text-lg transition-all hover:opacity-90">متابعة العمل</button>
           </div>
        </div>
      )}

      <style jsx>{`
        .shadow-3xl {
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5), 0 0 40px 0 rgba(var(--primary-rgb), 0.05);
        }
      `}</style>
    </div>
  );
}
