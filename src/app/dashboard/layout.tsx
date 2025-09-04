"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bell,
  Home,
  Package2,
  ShoppingCart,
  Users,
  CalendarDays,
  ShoppingBag,
  Settings,
  Menu,
  Info,
  Contact,
  DollarSign,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserNav } from "@/components/user-nav"
import { ThemeSwitcher } from "@/components/theme-switcher"
import Cart from "@/components/cart"
import { CartProvider } from "@/hooks/use-cart"
import Footer from "@/components/footer"
import DashboardLogo from "@/components/dashboard-logo"
import CommandPalette from "@/components/command-palette"
import QuickAddDialog from "@/components/quick-add-dialog"
import { DashboardDataProvider } from "@/hooks/use-dashboard-data"
import { FirebaseProvider } from "@/hooks/use-firebase"
import ProtectedRoute from "./protected-route"


function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setQuickAddOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
      <DashboardDataProvider>
        <CartProvider>
          <CommandPalette open={open} onOpenChange={setOpen} />
          <QuickAddDialog open={quickAddOpen} onOpenChange={setQuickAddOpen} />
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <DashboardLogo />
                </div>
                <div className="flex-1">
                  <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Home className="h-4 w-4" />
                      Nástenka
                    </Link>
                    <Link
                      href="/dashboard/booking"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <CalendarDays className="h-4 w-4" />
                      Rezervácie
                    </Link>
                    <Link
                      href="/dashboard/customers"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Users className="h-4 w-4" />
                      Zákazníci
                    </Link>
                    <Link
                      href="/dashboard/products"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Produkty
                    </Link>
                    <Link
                      href="/pricing"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <DollarSign className="h-4 w-4" />
                      Cenník
                    </Link>
                    <Link
                      href="/dashboard/about"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Info className="h-4 w-4" />
                      O nás
                    </Link>
                    <Link
                      href="/dashboard/contact"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Contact className="h-4 w-4" />
                      Kontakt
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Settings className="h-4 w-4" />
                      Nastavenia
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 md:hidden"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
                      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 mb-4">
                          <DashboardLogo />
                      </div>
                      <Link
                        href="/dashboard"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                      >
                        <Home className="h-6 w-6" />
                        Nástenka
                      </Link>
                      <Link
                        href="/dashboard/booking"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                      >
                        <CalendarDays className="h-6 w-6" />
                        Rezervácie
                      </Link>
                      <Link
                        href="/dashboard/customers"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                      >
                        <Users className="h-6 w-6" />
                        Zákazníci
                      </Link>
                      <Link
                        href="/dashboard/products"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                      >
                        <ShoppingBag className="h-6 w-6" />
                        Produkty
                      </Link>
                      <Link
                        href="/pricing"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                      >
                        <DollarSign className="h-6 w-6" />
                        Cenník
                      </Link>
                      <Link
                        href="/dashboard/about"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                      >
                        <Info className="h-6 w-6" />
                        O nás
                      </Link>
                      <Link
                        href="/dashboard/contact"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                      >
                        <Contact className="h-6 w-6" />
                        Kontakt
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                      >
                        <Settings className="h-6 w-6" />
                        Nastavenia
                      </Link>
                    </nav>
                    <div className="mt-auto p-4">
                        <ThemeSwitcher />
                    </div>
                  </SheetContent>
                </Sheet>
                <div className="w-full flex-1" />
                <ThemeSwitcher />
                <Cart />
                <UserNav />
              </header>
              <div className="flex flex-1 flex-col">
                <main className="flex-1 p-4 lg:p-6 bg-background">
                    <ProtectedRoute>
                        {children}
                    </ProtectedRoute>
                </main>
                <Footer />
              </div>
            </div>
          </div>
        </CartProvider>
      </DashboardDataProvider>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FirebaseProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </FirebaseProvider>
  )
}
