import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialsContent from "@/components/testimonials/TestimonialsContent";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('testimonials_title'),
    description: t('testimonials_desc'),
  };
}

export default function TestimonialsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <TestimonialsContent />
      <Footer />
    </div>
  );
}
