import { getTranslations, getLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";

export default async function DisclaimerPage() {
  const t = await getTranslations('Legal');
  const locale = await getLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-10 lg:p-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[100px] -z-10 group-hover:bg-rose-500/10 transition-colors"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-12">
                 <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-xl shadow-rose-500/5">
                    <AlertTriangle size={32} />
                 </div>
                 <div className="space-y-1">
                    <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter text-rose-500">{t('disclaimer_title')}</h1>
                    <p className="text-foreground-muted font-bold text-sm italic">{t('last_updated')}</p>
                 </div>
              </div>

              <div className="prose prose-invert max-w-none space-y-12">
                 <section className="space-y-6">
                    <p className="text-xl leading-relaxed font-medium italic text-foreground/80 border-l-4 border-rose-500/30 pl-8">
                       {t('disclaimer_content')}
                    </p>
                    
                    <div className="p-8 rounded-3xl bg-background/50 border border-rose-500/20 space-y-4">
                       <h3 className="text-xl font-black italic uppercase text-rose-500 flex items-center gap-2">
                          <AlertTriangle size={20} /> {t('disclaimer_risk_warning')}
                       </h3>
                       <p className="text-foreground-muted leading-relaxed font-bold italic">
                          {t('disclaimer_past_results')}
                       </p>
                    </div>
                 </section>

                 <div className="pt-10 border-t border-rose-500/10">
                    <p className="text-xs text-foreground-muted font-bold italic opacity-50 uppercase tracking-[0.2em] text-center">
                       Elite Technical Analysis Academy — Institutional Risk Management
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
