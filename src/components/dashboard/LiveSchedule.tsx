"use client";

import { Calendar, Clock, Video, ChevronRight, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LiveSchedule({ sessions }: { sessions: any[] }) {
  const t = useTranslations('Dashboard');
  
  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-20 bg-surface/10 rounded-[3rem] border border-dashed border-surface">
        <div className="w-16 h-16 bg-surface/30 rounded-full flex items-center justify-center mx-auto mb-6 text-foreground-muted">
           <Video size={32} />
        </div>
         <p className="text-foreground-muted italic font-medium">{t('no_sessions')}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between mb-2 px-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground-muted italic">{t('upcoming_sessions_title')}</h3>
         <div className="h-px flex-1 mx-8 bg-surface/50"></div>
      </div>
      
      {sessions.map((session: any) => (
        <div key={session._id} className="group relative bg-surface/30 backdrop-blur-xl p-8 rounded-[2.5rem] border border-surface hover:border-primary/30 transition-all shadow-lg overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
          
          <div className="relative z-10 flex items-center gap-6">
             <div className="w-16 h-16 bg-background/50 rounded-2xl flex flex-col items-center justify-center border border-surface group-hover:border-primary/20 transition-all font-black text-xs">
                <span className="text-primary">{new Date(session.startTime).toLocaleDateString(t('locale'), { month: 'short' })}</span>
                <span className="text-xl">{new Date(session.startTime).getDate()}</span>
             </div>
            
            <div className="space-y-1">
              <h4 className="text-xl font-black italic group-hover:text-primary transition-colors">{session.title}</h4>
              <div className="flex items-center gap-4 text-xs font-bold text-foreground-muted">
                  <span className="flex items-center gap-1"><Clock size={14} className="text-primary" /> {new Date(session.startTime).toLocaleTimeString(t('locale'), { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="w-1 h-1 bg-surface rounded-full"></span>
                  <span className="flex items-center gap-1 uppercase tracking-tighter italic">{t('live_transmission')}</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex items-center gap-4">
             <div className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                Starts in 2h 15m
             </div>
             <a 
               href={session.meetingLink} 
               target="_blank" 
               className="h-14 px-8 rounded-2xl bg-primary text-background flex items-center justify-center gap-3 font-black text-sm hover:bg-primary-hover shadow-xl transition-all hover:scale-105 active:scale-95"
             >
               {t('join_room')} <ExternalLink size={16} />
             </a>
          </div>
        </div>
      ))}
    </div>
  );
}
