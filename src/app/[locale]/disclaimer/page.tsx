"use client";

import { useTranslations, useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  const t = useTranslations('Legal');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-surface/30 border border-surface rounded-[2.5rem] p-10 lg:p-16">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <AlertTriangle size={28} />
               </div>
               <h1 className="text-4xl font-black">{t('disclaimer_title')}</h1>
            </div>
            <p className="text-foreground-muted mb-8 italic">{t('last_updated')}</p>
            <div className="prose prose-invert max-w-none space-y-6 text-lg">
               <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-200">
                  <p className="font-bold mb-4">{isRtl ? "تحذير مخاطر:" : "Risk Warning:"}</p>
                  <p>{t('disclaimer_content')}</p>
               </div>
               <p>{isRtl ? "النتائج السابقة لا تضمن النتائج المستقبلية. أنت المسؤول الوحيد عن قراراتك الاستثمارية." : "Past results do not guarantee future performance. You are solely responsible for your investment decisions."}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
