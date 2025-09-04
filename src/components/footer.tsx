
import Link from 'next/link';

export default function Footer() {
  const navigationLinks = [
    { href: '/', label: 'Domov' },
    { href: '/pricing', label: 'Cenník' },
    { href: '/dashboard/booking', label: 'Booking' },
    { href: '/dashboard/products', label: 'Obchod' },
    { href: '/dashboard/about', label: 'O nás' },
  ];

  return (
    <footer className="bg-card text-card-foreground border-t w-full">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Kontakt Section */}
          <div>
            <h3 className="font-headline text-xl font-semibold mb-4">KONTAKT</h3>
            <p className="font-bold">Papi Hair Design, s. r. o.</p>
            <p className="text-muted-foreground">Trieda SNP 61, (Spoločenský pavilón)</p>
            <p className="text-muted-foreground mt-2">
              Email: <a href="mailto:papihairdesign@gmail.com" className="hover:underline">papihairdesign@gmail.com</a>
            </p>
            <p className="text-muted-foreground">
              Telefón: <a href="tel:+421949459624" className="hover:underline">+421 949 459 624</a>
            </p>
          </div>

          {/* Otváracie hodiny Section */}
          <div>
            <h3 className="font-headline text-xl font-semibold mb-4">Otváracie hodiny</h3>
            <div className="space-y-1 text-muted-foreground">
              <p>PO: 08:00 – 17:00</p>
              <p>UT: 08:00 – 17:00</p>
              <p>ST: 08:00 – 17:00</p>
              <p>ŠT: 08:00 – 17:00</p>
              <p>PI: 08:00 – 17:00</p>
              <p>Víkend - Zatvorené</p>
            </div>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="font-headline text-xl font-semibold mb-4">Navigácia</h3>
            <nav className="flex flex-col space-y-2">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-muted-foreground hover:underline hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 md:px-6 py-4 text-center text-xs text-muted-foreground">
           &copy; {new Date().getFullYear()} Papi Hair Design PRO. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
