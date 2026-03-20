"use client";

import { useTranslations, useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, FileText, AlertTriangle } from "lucide-react";

export default function PrivacyPage() {
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
                  <Shield size={28} />
               </div>
               <h1 className="text-4xl font-black">{t('privacy_title')}</h1>
            </div>
            <p className="text-foreground-muted mb-8 italic">{t('last_updated')}</p>
            <div className="prose prose-invert max-w-none space-y-6 text-lg">
               <p>{t('privacy_content')}</p>
               {/* Expanded sections */}
               <h3 className="text-xl font-bold text-foreground">1. البيانات التي نجمعها</h3>
               <p>نجمع الاسم، البريد الإلكتروني، ورقم الهاتف عند التسجيل لضمان أمان حسابك وتقديم الدعم اللازم.</p>
               <h3 className="text-xl font-bold text-foreground">2. حماية البيانات</h3>
               <p>نستخدم تقنيات تشفير متطورة لحماية بياناتك من الوصول غير المصرح به.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
