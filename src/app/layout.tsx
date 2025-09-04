
"use client";

import * as React from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Chatbot from '@/components/chatbot';
import { ThemeProvider } from "@/components/theme-provider";
import { Playfair_Display, PT_Sans } from "next/font/google";
import { useToast } from '@/hooks/use-toast';
import { usePWA } from '@/hooks/use-pwa';
import { Button } from '@/components/ui/button';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

// Metadata can't be in a client component.
// `viewport` export is also not allowed in client components.

function AppUpdater() {
  const { toast } = useToast();
  const { isUpdateAvailable, update } = usePWA();

  React.useEffect(() => {
    if (isUpdateAvailable) {
      toast({
        title: 'Aktualizácia k dispozícii!',
        description: 'Nová verzia aplikácie je pripravená na inštaláciu.',
        duration: Infinity,
        action: (
            <Button onClick={() => update?.()}>
              Aktualizovať
            </Button>
        ),
      });
    }
  }, [isUpdateAvailable, toast, update]);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${ptSans.variable}`}>
       <head>
        <title>Papi Hair Design PRO</title>
        <meta name="description" content="Luxury hair design and booking." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Papi Hair" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Chatbot />
          <Toaster />
          <AppUpdater />
        </ThemeProvider>
      </body>
    </html>
  );
}
