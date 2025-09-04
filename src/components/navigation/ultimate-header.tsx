
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, ShoppingCart, Info, Contact, DollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '../theme-switcher';
import DashboardLogo from '../dashboard-logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import Cart from '../cart';
import { CartProvider } from '@/hooks/use-cart';

const navItems = [
    { name: 'Domov', href: '/', icon: Home },
    { name: 'Cenník', href: '/pricing', icon: DollarSign },
    { name: 'Produkty', href: '/dashboard/products', icon: ShoppingCart },
    { name: 'O nás', href: '/dashboard/about', icon: Info },
    { name: 'Kontakt', href: '/dashboard/contact', icon: Contact },
];

function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    return (
        <CartProvider>
            <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    <Menu className="h-6 w-6" />
                </Button>
                {isOpen && (
                    <div 
                        className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center"
                    >
                        <nav className="flex flex-col items-center gap-8">
                            {navItems.map((item) => (
                                <Link key={item.name} href={item.href} className="text-3xl font-headline" onClick={toggleMenu}>
                                    <span className="inline-block">
                                        {item.name}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                         <div className="absolute bottom-10">
                            <ThemeSwitcher />
                        </div>
                        <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon" onClick={toggleMenu}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </CartProvider>
    );
}


function DesktopNav() {
  return (
    <CartProvider>
        <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-medium hover:text-primary transition-colors">
                {item.name}
            </Link>
        ))}
          <ThemeSwitcher />
          <Cart />
          <Button asChild>
              <Link href="/dashboard/booking">Rezervovať</Link>
          </Button>
        </nav>
    </CartProvider>
  );
}


export function UltimateHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 px-4 lg:px-6 transition-colors duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between h-16 md:h-20">
        <DashboardLogo />
        {isMobile ? <MobileNav /> : <DesktopNav />}
      </div>
    </header>
  );
}
