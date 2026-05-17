import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Client Proof Pack Builder — Transform scattered campaign results into client-ready proof packs.',
  description: 'Client Proof Pack Builder helps small digital agency owners efficiently turn scattered campaign results into professional, client-ready proof packs that justify retainers and renewals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-50 antialiased`}>
        <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900 text-zinc-100 text-xs px-4 py-2 flex justify-between items-center">
          <p>⚡ Demo Mode — Client Proof Pack Builder · Built with NEXUS OS</p>
          <Link href="/dashboard" className="text-white hover:underline">
            Open Dashboard →
          </Link>
        </div>
        <div className="pt-9">
          {children}
        </div>
      </body>
    </html>
  );
}