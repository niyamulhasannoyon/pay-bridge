import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PayBridge - bKash Tokenized Checkout SaaS Gateway',
  description: 'Enterprise multi-tenant bKash payment gateway wrapper and SaaS platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
