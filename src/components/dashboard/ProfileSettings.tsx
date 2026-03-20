"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { User, Phone, Lock, ShieldCheck, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { updateStudentProfileAction } from "@/app/actions/student";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileSettings({ initialData }: { initialData: any }) {
  const t = useTranslations('Dashboard');
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" } as { type: 'success' | 'error' | '', text: string });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await updateStudentProfileAction({ name, phone, password: password || undefined });
      if (res.success) {
        setMessage({ type: 'success', text: "Profile updated successfully!" });
        setPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: 'error', text: res.message || "Failed to update profile" });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-12">
      <div className="lg:col-span-2 space-y-8">
         <div className="bg-surface/20 p-8 rounded-[2.5rem] border border-surface text-center space-y-4">
            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center text-primary text-4xl font-black">
               {name?.charAt(0)}
            </div>
            <div>
               <h3 className="text-2xl font-black">{name}</h3>
               <p className="text-foreground-muted text-sm italic">{initialData?.email}</p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
               <ShieldCheck size={12} /> Account Verified
            </div>
         </div>

         <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
            <h4 className="font-black mb-4 flex items-center gap-2 text-primary uppercase tracking-tighter italic">Why Update?</h4>
            <p className="text-xs text-foreground-muted leading-relaxed font-medium italic">
               Keeping your profile updated ensures you receive the correct certifications and that our instructors can contact you regarding live sessions.
            </p>
         </div>
      </div>

      <div className="lg:col-span-3">
         <form onSubmit={handleUpdate} className="bg-surface/30 p-10 rounded-[3rem] border border-surface shadow-sm space-y-8 backdrop-blur-xl">
            <AnimatePresence>
               {message.text && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-6 rounded-3xl flex items-center gap-4 text-sm font-bold border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
                  >
                     {message.type === 'success' ? <CheckCircle2 className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                     {message.text}
                  </motion.div>
               )}
            </AnimatePresence>

            <div className="grid sm:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground-muted ml-2">Display Name</label>
                  <div className="relative">
                     <User className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                     <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full bg-background/50 border border-surface rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary transition-all font-bold"
                     />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground-muted ml-2">Phone Number</label>
                  <div className="relative">
                     <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                     <input 
                        type="tel" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        className="w-full bg-background/50 border border-surface rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary transition-all font-bold"
                     />
                  </div>
               </div>
            </div>

            <div className="h-px bg-surface"></div>

            <div className="grid sm:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground-muted ml-2">New Password (Optional)</label>
                  <div className="relative">
                     <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                     <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="w-full bg-background/50 border border-surface rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary transition-all font-bold"
                     />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground-muted ml-2">Confirm Password</label>
                  <div className="relative">
                     <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                     <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="w-full bg-background/50 border border-surface rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary transition-all font-bold"
                     />
                  </div>
               </div>
            </div>

            <button 
               type="submit" 
               disabled={isLoading}
               className="w-full py-5 rounded-[2rem] bg-primary text-background font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
            >
               {isLoading ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={20} /> Update Security Profile</>}
            </button>
         </form>
      </div>
    </div>
  );
}
