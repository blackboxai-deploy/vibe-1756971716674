
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scissors, Palette, Gem, ShoppingBag } from 'lucide-react';
import { UltimateHeader } from '@/components/navigation/ultimate-header';
import { UltimateFooter } from '@/components/navigation/ultimate-footer';

export default function Home() {
  const services = [
    {
      icon: <Scissors className="h-10 w-10 text-primary" />,
      name: 'Precízne Strihy',
      description: 'Strihy na mieru, ktoré zodpovedajú vášmu štýlu a osobnosti.',
    },
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      name: 'Odborné Farbenie',
      description: 'Od jemných melírov až po odvážne nové vzhľady.',
    },
    {
      icon: <Gem className="h-10 w-10 text-primary" />,
      name: 'Luxusné Ošetrenia',
      description: 'Oživte svoje vlasy našimi prémiovými kúrami.',
    },
     {
      icon: <ShoppingBag className="h-10 w-10 text-primary" />,
      name: 'Shop',
      description: 'Nakúpte prémiové produkty pre starostlivosť o vlasy.',
      href: "http://www.goldhaircare.sk/affiliate/2208"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <UltimateHeader />
      <main className="flex-1">
        <section className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center text-center px-4 overflow-hidden">
           <Image
            src="https://picsum.photos/1800/1200"
            alt="Hero background of a stylish salon"
            fill
            className="object-cover absolute inset-0 z-0 brightness-50"
            priority
            data-ai-hint="luxury salon"
          />
          <div className="max-w-4xl z-10 text-white">
            <h1 className="text-fluid-hero font-headline font-bold tracking-tighter">
              Papi Hair Design PRO
            </h1>
            <p className="mt-4 text-fluid-body text-white/90">
              Umenie kaderníctva, povýšené na najvyššiu úroveň.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/dashboard/booking">Rezervovať termín</Link>
            </Button>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-fluid-headline font-headline font-bold tracking-tighter">
                  Naše Exkluzívne Služby
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Ponúkame starostlivo vybrané luxusné vlasové služby od našich majstrov stylistov.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-4 mt-12">
              {services.map((service) => (
                <div key={service.name} className="h-full">
                  <Link href={service.href || "#"} target={service.href ? "_blank" : "_self"} rel={service.href ? "noopener noreferrer" : ""} className="h-full block">
                      <Card className="bg-background border shadow-lg h-full hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="items-center">
                          {service.icon}
                          <CardTitle className="font-headline mt-4 text-lg">{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                          <p className="text-muted-foreground">{service.description}</p>
                      </CardContent>
                      </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto grid items-center gap-10 px-4 md:px-6">
            <div className="space-y-4 text-center">
              <h2 className="text-fluid-subheadline font-headline font-bold tracking-tighter">
                Vitajte v našom svete
              </h2>
              <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sme mladí dynamickí ľudia, ktorých spája vášeň ku krásnym vlasom. Milujeme štýl, záleží nám na zdraví a sme zodpovední k planéte. Naša tímová práca oslovuje aj tú najnáročnejšiu klientelu a vyznačujeme sa rodinným prístupom. Sme kaderníci, barberi, stylisti, ktorí si poradia s každou vlasovou výzvou. Kompletné vlasové služby a poradenstvo je u nás samozrejmosťou. Chceš sa o nás doznačiť viac? Kontaktuj nás.
              </p>
               <Button asChild>
                  <Link href="/dashboard/contact">Kontaktujte nás</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="flex flex-col items-center">
                <Image 
                    src="https://www.papihairdesign.sk/wp-content/uploads/2024/06/pucecka.jpg?w=1140&ssl=1"
                    alt="PAPI"
                    width={300}
                    height={300}
                    className="rounded-lg object-cover w-[300px] h-[300px]"
                    data-ai-hint="male portrait"
                  />
                <p className="mt-4 font-headline text-xl font-semibold">PAPI</p>
              </div>
              <div className="flex flex-col items-center">
                 <Image 
                  src="https://www.papihairdesign.sk/wp-content/uploads/2024/06/MATO_1.jpg?w=1140&ssl=1"
                  alt="MAŤO"
                  width={300}
                  height={300}
                  className="rounded-lg object-cover w-[300px] h-[300px]"
                  data-ai-hint="male portrait"
                />
                 <p className="mt-4 font-headline text-xl font-semibold">MAŤO</p>
              </div>
              <div className="flex flex-col items-center">
                 <Image 
                  src="https://www.papihairdesign.sk/wp-content/uploads/2024/04/MISKA_1.jpg?w=1140&ssl=1"
                  alt="MIŠKA"
                  width={300}
                  height={300}
                  className="rounded-lg object-cover w-[300px] h-[300px]"
                  data-ai-hint="female portrait"
                />
                 <p className="mt-4 font-headline text-xl font-semibold">MIŠKA</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <UltimateFooter />
    </div>
  );
}
