
"use client";

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function DashboardLogo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null on the server to avoid mismatch
    return (
       <Link href="/" className="flex items-center justify-center gap-2">
         <div style={{width: 180, height: 40}} />
       </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center justify-center gap-2">
      <Image
        src="https://www.papihairdesign.sk/wp-content/uploads/2024/04/papihairdesign-logo.png"
        alt="Papi Hair Design Logo"
        width={180}
        height={40}
        className={theme === 'dark' ? 'invert' : ''}
        priority
      />
    </Link>
  );
}
