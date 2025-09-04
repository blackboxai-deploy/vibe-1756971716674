"use client"

import * as React from "react"
import {
  Calendar,
  Contact,
  CreditCard,
  Home,
  Info,
  LogOut,
  Moon,
  Plus,
  Settings,
  ShoppingBag,
  Sun,
  User,
  Users,
  DollarSign,
  Zap,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const { setTheme } = useTheme()

  const runCommand = React.useCallback((command: () => unknown) => {
    onOpenChange(false)
    command()
  }, [onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Zadajte príkaz alebo hľadajte..." />
      <CommandList>
        <CommandEmpty>Nenašli sa žiadne výsledky.</CommandEmpty>
        <CommandGroup heading="Návrhy">
          <CommandItem onSelect={() => {
              onOpenChange(false);
              const event = new CustomEvent('open-quick-add');
              window.dispatchEvent(event);
          }}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Rýchle pridanie</span>
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/booking"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Nová rezervácia</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/customers"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Nový zákazník</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigácia">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Nástenka</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/booking"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Rezervácie</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/customers"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Zákazníci</span>
          </CommandItem>
           <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/products"))}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Produkty</span>
          </CommandItem>
           <CommandItem onSelect={() => runCommand(() => router.push("/pricing"))}>
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Cenník</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/about"))}>
            <Info className="mr-2 h-4 w-4" />
            <span>O nás</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/contact"))}>
            <Contact className="mr-2 h-4 w-4" />
            <span>Kontakt</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Nastavenia">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Nastavenia</span>
          </CommandItem>
          <CommandGroup heading="Téma">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              Svetlá
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              Tmavá
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Settings className="mr-2 h-4 w-4" />
              Systémová
            </CommandItem>
          </CommandGroup>
           <CommandItem onSelect={() => runCommand(() => router.push("/login"))}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Odhlásiť sa</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
