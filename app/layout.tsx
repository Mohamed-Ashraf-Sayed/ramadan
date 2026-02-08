import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "أسداف | أكاديمية شباب أسرة المهيدب",
  description: "مسابقة تنافسية ثقافية متنوعة في مجالات متعددة مختارة من صنوف العلوم والمعارف - لكل أفراد الأسرة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-cairo antialiased`}>
        {children}
      </body>
    </html>
  );
}
