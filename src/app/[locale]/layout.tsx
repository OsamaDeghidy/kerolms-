import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";
import SessionGuard from "@/components/SessionGuard";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kero Trade | منصة تعلم التداول الاحترافي",
  description: "المنصة التعليمية الأقوى لاحتراف التداول بالتحليل الموجي والكلاسيكي مع Kero Trade",
};

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
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${inter.variable} antialiased font-sans`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <SessionGuard />
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
