import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Noto_Sans_HK } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansHk = Noto_Sans_HK({
  variable: '--font-noto-sans-hk',
});

export const metadata: Metadata = {
  title: 'PO Simulator',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PO Simulator',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1c1c1c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${notoSansHk.variable} antialiased dark`}>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
