import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";
import SessionGuard from "@/components/SessionGuard";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  
  const siteName = "Kero Trade";
  const title = t('site_title') || `${siteName} | Professional Trading Academy`;
  const description = t('site_description') || "Master the art of trading with elite strategies and wave analysis.";

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description: description,
    icons: {
      icon: "/favicon.ico",
    },
    robots: "index, follow",
    openGraph: {
      title: title,
      description: description,
      siteName: siteName,
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${cairo.variable} ${inter.variable} antialiased font-sans bg-background text-foreground selection:bg-primary/30 selection:text-primary`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <SessionGuard />
            <div className="relative overflow-x-hidden">
               {children}
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
