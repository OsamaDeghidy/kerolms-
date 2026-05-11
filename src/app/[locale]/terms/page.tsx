import { getTranslations, getLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export default async function TermsPage() {
  const t = await getTranslations('Legal');
  const locale = await getLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-surface/30 border border-surface rounded-[2.5rem] p-10 lg:p-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-12">
                 <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/5">
                    <FileText size={32} />
                 </div>
                 <div className="space-y-1">
                    <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">{t('terms_title')}</h1>
                    <p className="text-foreground-muted font-bold text-sm italic">{t('last_updated')}</p>
                 </div>
              </div>

              <div className="prose prose-invert max-w-none space-y-12">
                 <section className="space-y-4">
                    <p className="text-xl leading-relaxed font-medium italic text-foreground/80 border-l-4 border-primary/30 pl-8">
                       {t('terms_content')}
                    </p>
                 </section>

                 <div className="grid gap-8">
                    <LegalSection 
                      title={t('terms_p1_title')} 
                      content={t('terms_p1_content')} 
                      isRtl={isRtl}
                    />
                    <LegalSection 
                      title={t('terms_p2_title')} 
                      content={t('terms_p2_content')} 
                      isRtl={isRtl}
                    />
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

function LegalSection({ title, content, isRtl }: { title: string, content: string, isRtl: boolean }) {
  return (
    <div className={`p-8 rounded-3xl bg-background/50 border border-surface group hover:border-primary/20 transition-all ${isRtl ? 'text-right' : 'text-left'}`}>
       <h3 className="text-xl font-black mb-4 italic uppercase text-primary tracking-wide">{title}</h3>
       <p className="text-foreground-muted leading-relaxed font-bold italic">{content}</p>
    </div>
  )
}
