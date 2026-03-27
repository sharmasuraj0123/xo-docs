import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';
import { Geist } from 'next/font/google';
import { AskXO } from '@/components/ask-xo';
import './global.css';

const geist = Geist({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geist.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider theme={{ defaultTheme: 'dark', enableSystem: true }}>
          {children}
          <AskXO />
        </RootProvider>
      </body>
    </html>
  );
}
