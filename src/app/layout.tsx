import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PayBridge - Enterprise Multi-Gateway SaaS Platform',
  description: 'Enterprise multi-tenant bKash, Nagad, Rocket & Bank payment gateway wrapper platform for Bangladesh.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070a12] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
