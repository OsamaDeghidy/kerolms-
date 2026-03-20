"use client";

import { FileText, Download, Search, FileCode, Presentation, Globe } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ResourceCenter({ courses }: { courses: any[] }) {
  const t = useTranslations('Dashboard');
  const [search, setSearch] = useState("");
  
  // Flatten resources from all courses for the demo
  const allResources = courses?.flatMap(course => 
    (course.learnings || []).map((item: string, idx: number) => ({
      id: `${course._id}-${idx}`,
      title: item,
      courseTitle: course.title,
      type: item.toLowerCase().includes('pdf') ? 'pdf' : item.toLowerCase().includes('tools') ? 'code' : 'doc'
    }))
  ) || [];

  const filtered = allResources.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="relative group max-w-2xl mx-auto mb-12">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder={t('search_materials')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-surface/30 border border-surface rounded-[2.5rem] py-6 pl-16 pr-8 outline-none focus:border-primary/50 transition-all font-bold placeholder:italic placeholder:font-medium shadow-sm backdrop-blur-xl text-foreground"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((res) => (
          <div key={res.id} className="group p-6 rounded-[2.5rem] bg-surface/20 border border-surface hover:border-primary/30 transition-all hover:shadow-2xl relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10"></div>
             
             <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-background/50 rounded-2xl flex items-center justify-center text-primary border border-surface">
                   {res.type === 'pdf' ? <FileText size={24} /> : res.type === 'code' ? <FileCode size={24} /> : <FileText size={24} />}
                </div>
                <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-background active:scale-95">
                   <Download size={18} />
                </button>
             </div>
             
             <div className="space-y-2">
                <h4 className="font-black italic text-lg leading-tight group-hover:text-primary transition-colors">{res.title}</h4>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-foreground-muted italic">
                   <span className="px-2 py-0.5 rounded bg-surface border border-surface">{t('course_asset')}</span>
                   <span className="truncate">{res.courseTitle}</span>
                </div>
             </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-surface/50 rounded-full flex items-center justify-center mx-auto text-foreground-muted">
                <Globe size={40} />
             </div>
             <p className="text-foreground-muted font-bold italic">{t('no_resources')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
