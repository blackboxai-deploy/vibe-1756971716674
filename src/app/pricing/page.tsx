
"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Logo from "@/components/logo"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Footer from "@/components/footer"
import { ThemeSwitcher } from "@/components/theme-switcher"

const gentlemenServices = [
    { name: 'Pánsky Strih', description: 'Umytie vlasov / Strih (nožnice/strojček) / Umytie vlasov / Styling', price: 20 },
    { name: 'Pánsky strih + Úprava brady', description: 'Umytie vlasov / Strih / Úprava brady / Umytie vlasov a brady / Styling / Dezinfekcia po holení', price: 25 },
    { name: 'Pánsky Špecial', description: 'Umytie vlasov / Strih (nožnice/strojček) / Úprava brady / Depilácia (nos/uši) / Peeling / Čierna maska / Masáž vlasovej pokožky + Umytie vlasov / Ušné sviečky / Styling', price: 50 },
    { name: 'Detský Strih', description: 'Umytie vlasov / Strih (nožnice/strojček) / Umytie vlasov / Styling / od 5 do 12 rokov', price: 15 },
    { name: 'Úprava Brady', description: 'Strihanie brady / Úprava kontúr (strojček/britva) / Umytie brady / Styling / Dezinfekcia po holení', price: 7 },
    { name: 'Ušné sviečky', description: 'Odstránenie ušného mazu', price: 10 },
    { name: 'Depilácia voskom', description: 'Odstránenie chĺpkov z nosa / uší', price: 4 },
    { name: 'Farbenie', description: 'Brada / Vlasy', price: 10 },
]

const ladiesServices = [
    { name: 'Dámske Strihanie', description: 'Umytie vlasov / Strih / Vyfúkanie vlasov / Finálny styling', price: 30 },
    { name: 'Jednoduché Farbenie', description: 'Farbenie korienkov / Vyfúkanie vlasov / Finálny Styling', price: 40 },
    { name: 'Jednoduché Farbenie + Strihanie', description: 'Farbenie korienkov / Strihanie / Vyfúkanie vlasov / Finálny Styling', price: 60 },
    { name: 'Vyfúkanie Vlasov', description: 'Umytie vlasov / Vyfúkanie vlasov / Finálny styling', price: 20 },
    { name: 'Ošetrenie Methamorphic', description: 'Hĺbkové hydratačné a proteínové ošetrenie / Finálny styling', price: 20 },
    { name: 'Základné Farbenie', description: 'Farbenie celých dĺžok vlasov / Vyfúkanie vlasov / Finálny Styling', price: 60 },
    { name: 'Základné Farbenie + Strihanie', description: 'Farbenie celých dĺžok vlasov / Strihanie / Vyfúkanie vlasov / Finálny Styling', price: 80 },
    { name: 'Zmena Farby Vlasov', description: 'Rôzne techniky zosvetlovania (Melír, AirTouch, Balleyage) / Strihanie / Vyfúkanie vlasov / Finálny styling', price: 130 },
    { name: 'Spoločenský Účes', description: 'CENA SA ODVÍJA OD NÁROČNOSTI ÚČESU', price: 40 },
    { name: 'Copiky Braids', description: 'Cena sa odvíja od použitého materiálu', price: 120 },
    { name: 'Brazílsky Keratín', description: 'Cena sa odvíja od použitého materiálu cena za 1ml -1.50€', price: 18 },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Logo />
        <nav className="hidden md:flex gap-4 sm:gap-6 items-center">
            <Link
              href="/"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Domov
            </Link>
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Prihlásenie
          </Link>
          <Button asChild>
              <Link href="/dashboard/booking">Rezervovať</Link>
            </Button>
           <Link
              href="/pricing"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Cenník
            </Link>
            <ThemeSwitcher />
        </nav>
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
            <SheetContent side="right">
              <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-6 text-lg font-medium mt-10">
                <Logo />
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Domov
                </Link>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Prihlásenie
                </Link>
                <Link
                  href="/dashboard/booking"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Rezervovať
                </Link>
                 <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cenník
                </Link>
                 <ThemeSwitcher />
              </nav>
            </SheetContent>
          </Sheet>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-fluid-headline font-headline font-bold text-foreground">Cenník Služieb</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Cena sa odvíja od výberu kaderníka a použitého materiálu. Všetky ceny sú uvedené od najnižších.
            </p>
          </div>

          <div className="space-y-12">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Páni</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Služba</TableHead>
                      <TableHead className="w-[45%]">Popis</TableHead>
                      <TableHead className="text-right">Cena</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gentlemenServices.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell className="text-muted-foreground">{service.description}</TableCell>
                        <TableCell className="text-right font-bold text-lg">od €{service.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Dámy</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Služba</TableHead>
                      <TableHead className="w-[45%]">Popis</TableHead>
                      <TableHead className="text-right">Cena</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ladiesServices.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell className="text-muted-foreground">{service.description}</TableCell>
                        <TableCell className="text-right font-bold text-lg">od €{service.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
