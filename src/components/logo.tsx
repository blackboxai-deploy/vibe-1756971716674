
"use client";

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function Logo() {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
       return (
         <Link href="/" className="flex items-center justify-center gap-2">
           <div style={{width: 240, height: 50}} />
         </Link>
      );
    }

  return (
    <Link href="/" className="flex items-center justify-center gap-2">
       <Image
        src="https://www.papihairdesign.sk/wp-content/uploads/2024/04/papihairdesign-logo.png"
        alt="Papi Hair Design Logo"
        width={240}
        height={50}
        className={theme === 'dark' ? 'invert' : ''}
        priority
      />
    </Link>
  );
}
