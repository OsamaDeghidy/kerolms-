"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, Building, Smartphone, Upload, Wallet, Loader2, CheckCircle2, ShieldCheck, Info, Copy, Zap, Globe } from "lucide-react";
import { use, useMemo } from "react";
import { getCourseBySlugAction } from "@/app/actions/courses";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocale, useTranslations } from "next-intl";

export default function CheckoutPage({ params }: { params: Promise<{ courseId: string; locale: string }> }) {
  const { courseId } = use(params);
  const locale = useLocale();
  const t = useTranslations('Checkout');
  const isRtl = locale === "ar";
  
  const [course, setCourse] = useState<any>(null);
  const [method, setMethod] = useState<"bank" | "usdt" | "vodafone_cash" | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    getCourseBySlugAction(courseId).then(data => {
      setCourse(data);
      setLoading(false);
    });
  }, [courseId]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async () => {
    if (!method || !file) return;
    setSubmitting(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result;
        
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course._id,
            amount: course.price,
            paymentMethod: method,
            proofImage: base64,
            transactionId: transactionId
          }),
        });

        if (res.ok) {
          setIsSuccess(true);
        } else {
          const err = await res.json();
          alert(err.message || t('error_submitting'));
        }
        setSubmitting(false);
      };
    } catch (err) {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
       <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute top-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
       </div>
    </div>
  );

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full translate-y-1/2"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-xl w-full text-center bg-surface/30 backdrop-blur-3xl p-12 rounded-[4rem] border border-surface shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative z-10"
        >
          <div className="w-28 h-28 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
            <CheckCircle2 size={56} />
          </div>
          <h2 className="text-4xl font-black mb-6 uppercase italic tracking-tighter">
            {t('order_transmitted')}
          </h2>
          <div className="p-6 bg-background/50 rounded-3xl border border-surface mb-10 text-lg font-medium leading-relaxed italic text-foreground-muted">
            {t('success_notice')}
          </div>
          <Link href="/dashboard" className="group relative w-full py-6 rounded-[2rem] bg-primary text-background font-black text-xl flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-2 active:scale-95 overflow-hidden">
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
             <span className="relative z-10">{t('enter_hub')}</span>
             {isRtl ? <ArrowLeft size={24} className="relative z-10" /> : <ArrowRight size={24} className="relative z-10" />}
          </Link>
        </motion.div>
      </div>
    );
  }

  const USDT_ADDRESS = "TP53orE4XKrByYPVb18TJv5qJS8iTqDsgF";
  const BANK_DETAILS = {
    name: "ADIB",
    holder: "KIROLOS AMIN KALDAS BASHTA",
    acc: "29131731",
    iban: "AE410500000000029131731",
    swift: "ABDIAEADXXX",
    currency: "AED"
  };
  const VF_CASH = "01064589630";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="flex-1 pt-32 pb-40 relative">
        {/* Atmosphere */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, x: isRtl ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
            <Link href={`/courses/${courseId}`} className="inline-flex items-center gap-2 text-foreground-muted hover:text-primary transition-all font-bold group">
               {isRtl ? <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /> : <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />}
               {t('back_to_course')}
            </Link>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-4"
             >
                <div className="flex items-center gap-3 text-primary text-xs font-black uppercase tracking-[0.2em] mb-2">
                   <ShieldCheck size={16} />
                   <span>{t('secure_checkout')}</span>
                </div>
                <h1 className="text-6xl font-black italic tracking-tighter leading-none uppercase">
                  {t.rich('finalize_enrollment_rich', {
                    span: (chunks) => <span className="text-primary text-glow-primary">{chunks}</span>
                  })}
                </h1>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-surface/30 backdrop-blur-xl border border-surface p-8 rounded-[3rem] shadow-2xl min-w-[320px] relative overflow-hidden group hover:border-primary/30 transition-all"
             >
                <div className="absolute top-0 right-0 w-2 h-full bg-primary/20"></div>
                <div className="flex justify-between items-start gap-6 border-b border-surface pb-6 mb-6">
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted block mb-1">{t('elite_access')}</span>
                      <h3 className="font-black text-xl leading-tight">{course.title}</h3>
                   </div>
                   <div className="w-14 h-14 bg-primary/10 rounded-[1.2rem] flex items-center justify-center border border-primary/20">
                      <Zap size={28} className="text-primary" />
                   </div>
                </div>
                <div className="flex justify-between items-end">
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted block mb-1">{t('invested_capital')}</span>
                      <span className="text-4xl font-black text-primary font-mono tracking-tighter">${course.price}</span>
                   </div>
                   <div className="text-[10px] font-black text-foreground-muted bg-surface/50 px-3 py-1.5 rounded-lg border border-surface uppercase tracking-tighter">{t('instant_access')}</div>
                </div>
             </motion.div>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8 space-y-12">
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-primary text-background flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20 italic">01</div>
                   <h2 className="text-3xl font-black uppercase italic tracking-tighter">{t('step_1_title')}</h2>
                </div>
                
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { id: "usdt", label: "USDT (TRC20)", icon: <Wallet size={32} /> },
                    { id: "bank", label: t('bank_transfer'), icon: <Building size={32} /> },
                    { id: "vodafone_cash", label: t('vodafone_cash'), icon: <Smartphone size={32} /> }
                  ].map((item: any) => (
                    <button 
                      key={item.id}
                      onClick={() => setMethod(item.id)}
                      className={`relative p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-6 group overflow-hidden ${method === item.id ? 'bg-primary/5 border-primary text-primary shadow-[0_20px_40px_rgba(var(--primary-rgb),0.2)] scale-105' : 'bg-surface/20 border-surface hover:border-primary/30 text-foreground-muted'}`}
                    >
                      {method === item.id && <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>}
                      <div className={`p-5 rounded-[1.5rem] transition-all duration-500 ${method === item.id ? 'bg-primary text-background rotate-12 scale-110 shadow-lg' : 'bg-surface/50 text-foreground-muted group-hover:text-primary group-hover:scale-110'}`}>
                        {item.icon}
                      </div>
                      <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
                </div>
              </section>
              
              <AnimatePresence mode="wait">
                {method ? (
                  <motion.section 
                    key={method}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-primary text-background flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20 italic">02</div>
                       <h2 className="text-3xl font-black uppercase italic tracking-tighter">{t('step_2_title')}</h2>
                    </div>
                    
                    <div className="bg-surface/30 backdrop-blur-2xl p-10 rounded-[3.5rem] border-2 border-primary/20 shadow-2xl relative overflow-hidden group flex flex-col lg:flex-row gap-10">
                       <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]"></div>
                       
                       <div className="lg:w-1/3 space-y-4">
                          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20 text-primary mb-6">
                             {method === "usdt" ? <Wallet size={40} /> : method === "bank" ? <Building size={40} /> : <Smartphone size={40} />}
                          </div>
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight">
                             {method === "usdt" ? t('usdt_asset') : method === "bank" ? t('bank_hub') : t('vodafone_hub')}
                          </h3>
                          <p className="text-sm font-medium italic text-foreground-muted leading-relaxed">
                             {t('manual_notice')}
                          </p>
                       </div>

                       <div className="lg:w-2/3 space-y-6">
                          {method === "usdt" && (
                            <div className="space-y-6">
                               <div className="flex justify-between items-center bg-background/50 p-5 rounded-2xl border border-surface">
                                  <div className="flex items-center gap-3">
                                     <Globe size={18} className="text-primary" />
                                     <span className="font-black text-xs uppercase tracking-widest text-foreground-muted">{t('network')}</span>
                                  </div>
                                  <span className="font-black text-xl text-primary font-mono">TRC20</span>
                               </div>
                               <div className="space-y-3">
                                  <span className="font-black text-[10px] text-foreground-muted px-4 block uppercase tracking-widest">{t('asset_address')}</span>
                                  <div className="relative group/copy">
                                     <div className="bg-background/80 p-6 rounded-[1.5rem] border-2 border-surface text-center font-mono font-black text-sm break-all tracking-wider shadow-inner text-primary/80">
                                        {USDT_ADDRESS}
                                     </div>
                                     <button 
                                       onClick={() => copyToClipboard(USDT_ADDRESS, 'usdt')}
                                       className={`absolute top-1/2 ${isRtl ? 'left-4' : 'right-4'} -translate-y-1/2 p-2 bg-primary text-background rounded-xl opacity-0 group-hover/copy:opacity-100 transition-all shadow-lg hover:scale-110`}
                                     >
                                        {copied === 'usdt' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                     </button>
                                  </div>
                               </div>
                               <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 flex gap-3 items-center">
                                  <Info size={20} className="text-red-400 shrink-0" />
                                  <p className="text-[10px] text-red-400 font-black uppercase tracking-tight leading-tight">
                                    {t('copy_notice')}
                                  </p>
                                </div>
                            </div>
                          )}

                          {method === "bank" && (
                            <div className="grid gap-4">
                               <BankField label={t('bank_name')} value={BANK_DETAILS.name} copyid="bank_name" onCopy={copyToClipboard} copied={copied} isRtl={isRtl} />
                               <BankField label={t('acc_holder')} value={BANK_DETAILS.holder} copyid="bank_holder" onCopy={copyToClipboard} copied={copied} isRtl={isRtl} />
                               <BankField label={t('acc_num')} value={BANK_DETAILS.acc} copyid="bank_acc" onCopy={copyToClipboard} copied={copied} isRtl={isRtl} />
                               <BankField label={t('iban')} value={BANK_DETAILS.iban} copyid="bank_iban" onCopy={copyToClipboard} copied={copied} isRtl={isRtl} />
                               <div className="grid grid-cols-2 gap-4">
                                  <BankField label={t('swift')} value={BANK_DETAILS.swift} copyid="bank_swift" onCopy={copyToClipboard} copied={copied} isRtl={isRtl} />
                                  <BankField label={t('currency')} value={BANK_DETAILS.currency} />
                               </div>
                            </div>
                          )}

                          {method === "vodafone_cash" && (
                            <div className="text-center space-y-8 py-4">
                               <div className="space-y-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">{t('hub_number')}</span>
                                  <div className="relative group/copy inline-block mx-auto">
                                     <div className="text-5xl font-black text-primary font-mono tracking-[0.2em] py-4" dir="ltr">
                                        {VF_CASH}
                                     </div>
                                     <button 
                                       onClick={() => copyToClipboard(VF_CASH, 'vf')}
                                       className={`absolute -top-2 ${isRtl ? '-left-12' : '-right-12'} p-3 bg-primary text-background rounded-2xl opacity-0 group-hover/copy:opacity-100 transition-all shadow-lg`}
                                     >
                                        {copied === 'vf' ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                                     </button>
                                  </div>
                               </div>
                               <div className="flex items-center justify-center gap-4 p-4 bg-background/50 rounded-2xl border border-surface">
                                  <Smartphone size={20} className="text-primary" />
                                  <p className="text-xs font-black uppercase tracking-wider text-foreground-muted">{t('vodafone_cash')}</p>
                               </div>
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="space-y-8 pt-8">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary text-background flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20 italic">03</div>
                          <h2 className="text-3xl font-black uppercase italic tracking-tighter">{t('step_3_title')}</h2>
                       </div>
                       
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-foreground-muted px-4 uppercase tracking-widest">{t('transaction_id')}</label>
                             <div className="relative">
                                <SearchOverlay icon={<Zap size={18} />} isRtl={isRtl} />
                                <input 
                                  type="text" 
                                  placeholder={t('transaction_placeholder')}
                                  value={transactionId}
                                  onChange={(e) => setTransactionId(e.target.value)}
                                  className={`w-full bg-surface/30 border-2 border-surface rounded-[1.5rem] ${isRtl ? 'pr-14 pl-6' : 'pl-14 pr-6'} py-5 outline-none focus:border-primary/50 transition-all font-bold tracking-widest`}
                                />
                             </div>
                          </div>
                          
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-foreground-muted px-4 uppercase tracking-widest">{t('receipt_upload')}</label>
                             <div className="relative group/upload h-[68px]">
                                <input 
                                   type="file" 
                                   onChange={(e) => setFile(e.target.files?.[0] || null)}
                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                                   accept="image/*" 
                                />
                                <div className={`absolute inset-0 bg-surface/30 border-2 border-dashed rounded-[1.5rem] px-8 flex items-center justify-between group-hover/upload:border-primary/50 transition-all z-10 ${file ? 'border-primary bg-primary/5' : 'border-surface'}`}>
                                   <span className="text-sm font-black italic truncate max-w-[200px] text-foreground-muted">
                                      {file ? file.name : t('receipt_upload')}
                                   </span>
                                   <div className={`p-2 rounded-xl transition-colors ${file ? 'bg-primary text-background' : 'bg-surface/50 text-primary'}`}>
                                      <Upload size={20} />
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>

                       <button 
                         onClick={handleSubmit}
                         disabled={submitting || !file}
                         className="group relative w-full py-7 rounded-[2.5rem] bg-primary text-background font-black text-2xl uppercase italic tracking-widest disabled:opacity-40 disabled:grayscale transition-all shadow-[0_30px_60px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-4 overflow-hidden mt-8"
                       >
                         <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                         {submitting ? (
                            <>
                              <Loader2 className="animate-spin" size={32} />
                              <span className="relative z-10">{t('transmitting')}</span>
                            </>
                         ) : (
                            <>
                              <ShieldCheck size={32} className="relative z-10" />
                              <span className="relative z-10">{t('confirm_button')}</span>
                            </>
                         )}
                       </button>

                       <p className="text-center text-[10px] font-black uppercase tracking-widest text-foreground-muted italic">
                          {t('terms_notice')}
                       </p>
                    </div>
                  </motion.section>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 px-10 rounded-[3rem] bg-surface/10 border-2 border-dashed border-surface text-center space-y-4"
                  >
                     <div className="w-16 h-16 bg-surface/30 rounded-full flex items-center justify-center mx-auto text-foreground-muted">
                        <Info size={32} />
                     </div>
                     <p className="font-black text-xl italic text-foreground-muted uppercase tracking-tighter">
                        {t('awaiting_selection')}
                     </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <aside className="lg:col-span-4 space-y-8">
               <div className="bg-surface/30 backdrop-blur-xl p-10 rounded-[3.5rem] border border-surface shadow-2xl sticky top-32 overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                  
                  <h3 className="font-black text-2xl mb-10 italic uppercase border-b border-surface pb-6 flex items-center gap-4">
                     <div className="w-1 h-8 bg-primary"></div>
                     {t('order_summary')}
                  </h3>
                  
                  <div className="space-y-8">
                     <div className="bg-background/50 p-6 rounded-[2rem] border border-surface group hover:border-primary/30 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted block mb-3">{t('target_curriculum')}</span>
                        <h4 className="font-black text-xl leading-tight group-hover:text-primary transition-colors">{course.title}</h4>
                     </div>
                     
                     <div className="pt-6 border-t border-surface space-y-6">
                        <div className="flex justify-between items-center group">
                           <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted block mb-1">{t('tuition_fee')}</span>
                              <span className="text-5xl font-black text-primary font-mono tracking-tighter text-glow-primary">${course.price}</span>
                           </div>
                           <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                              <Zap className="text-primary" size={32} />
                           </div>
                        </div>

                        <ul className="space-y-4 pt-4">
                           <SummaryBullet icon={<ShieldCheck />} text={t('lifetime_access')} />
                           <SummaryBullet icon={<Globe />} text={t('intel_support')} />
                           <SummaryBullet icon={<Zap />} text={t('market_sync')} />
                        </ul>
                     </div>

                     <div className="p-5 bg-background/80 rounded-2xl text-[10px] font-bold leading-relaxed text-foreground-muted italic border border-primary/10">
                        {t('manual_notice')}
                     </div>
                  </div>
               </div>
            </aside>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function BankField({ label, value, copyid, onCopy, copied, isRtl }: { label: string; value: string; copyid?: string; onCopy?: any; copied?: any; isRtl?: boolean }) {
   return (
      <div className="space-y-2">
         <span className="text-[9px] font-black uppercase tracking-widest text-foreground-muted px-3">{label}</span>
         <div className="relative group/copy">
            <div className={`p-4 rounded-xl border border-surface bg-background/50 font-bold text-xs truncate ${copyid ? (isRtl ? 'pl-12' : 'pr-12') : ''}`}>
               {value}
            </div>
            {copyid && onCopy && (
               <button 
                  onClick={() => onCopy(value, copyid)}
                  className={`absolute top-1/2 ${isRtl ? 'left-3' : 'right-3'} -translate-y-1/2 text-primary opacity-0 group-hover/copy:opacity-100 transition-all`}
               >
                  {copied === copyid ? <CheckCircle2 size={16} /> : <Copy size={16} />}
               </button>
            )}
         </div>
      </div>
   );
}

function SummaryBullet({ icon, text }: { icon: any; text: string }) {
   return (
      <li className="flex items-center gap-3 text-xs font-black italic text-foreground-muted">
         <div className="text-primary">{icon}</div>
         <span>{text}</span>
      </li>
   );
}

function SearchOverlay({ icon, isRtl }: { icon: any; isRtl?: boolean }) {
   return (
      <div className={`absolute ${isRtl ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-primary pointer-events-none`}>
         {icon}
      </div>
   );
}
