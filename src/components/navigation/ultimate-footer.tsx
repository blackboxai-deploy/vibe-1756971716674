
"use client"

import { useState } from 'react'
import { useRef } from 'react'
import { 
  Instagram, 
  Facebook, 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

const footerLinks = {
  services: [
    { name: 'Pánske Strihy', href: '/pricing' },
    { name: 'Dámske Strihy', href: '/pricing' },
    { name: 'Farbenie Vlasov', href: '/pricing' },
    { name: 'Ošetrenia', href: '/pricing' },
  ],
  company: [
    { name: 'O Nás', href: '/dashboard/about' },
    { name: 'Náš Tím', href: '/dashboard/about' },
    { name: 'Kontakt', href: '/dashboard/contact' },
    { name: 'Blog', href: '#' },
  ],
  support: [
    { name: 'FAQ', href: '#' },
    { name: 'Online Rezervácia', href: '/dashboard/booking' },
    { name: 'Cenník', href: '/pricing' },
    { name: 'Recenzie', href: '#' },
  ]
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
]

export function UltimateFooter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const footerRef = useRef(null)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      // In a real app, you would handle the newsletter subscription here.
    }
  }

  return (
    <footer ref={footerRef} className="relative bg-card text-card-foreground border-t overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
        
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
                Zostaňte v Kontakte
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Získajte exkluzívne ponuky, beauty tipy a buďte prvý kto sa dozvie o našich novinkách!
            </p>
        </div>
        
        {!isSubscribed ? (
            <form 
                onSubmit={handleSubscribe} 
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-16"
            >
                <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="váš@email.sk"
                    className="bg-background/50 backdrop-blur-md border-border/20 focus:border-primary/50 rounded-xl flex-1"
                    required 
                />
                <Button type="submit" className="w-full sm:w-auto">
                    Odoberať
                </Button>
            </form>
        ) : (
            <p className="text-center text-lg text-primary font-bold mb-16">
                Ďakujeme za odber! ✨
            </p>
        )}

        <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center justify-center gap-2">
                <span className="font-headline text-3xl font-bold tracking-tight">
                    Papi Hair Design PRO
                </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Váš špecialista na vlasy s 15-ročnými skúsenosťami. Vytvárame jedinečné účesy pre každého klienta.
            </p>
        </div>

        <div className="flex justify-center gap-8 md:gap-16 mt-12 text-center">
            <div>
                <h3 className="font-headline font-semibold">Služby</h3>
                <ul className="mt-4 space-y-2">
                {footerLinks.services.map((link) => (
                    <li key={link.href + link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                    </li>
                ))}
                </ul>
            </div>
            <div>
                <h3 className="font-headline font-semibold">Spoločnosť</h3>
                <ul className="mt-4 space-y-2">
                {footerLinks.company.map((link) => (
                    <li key={link.href + link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                    </li>
                ))}
                </ul>
            </div>
            <div>
                <h3 className="font-headline font-semibold">Podpora</h3>
                <ul className="mt-4 space-y-2">
                {footerLinks.support.map((link) => (
                    <li key={link.href + link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                    </li>
                ))}
                </ul>
            </div>
        </div>


        <div className="mt-12 pt-8 border-t flex flex-col items-center gap-6">
            <div className="flex gap-4">
                {socialLinks.map((social) => (
                    <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <social.icon className="h-6 w-6" />
                    </a>
                ))}
            </div>
            <div className="text-sm text-muted-foreground text-center">
                &copy; {new Date().getFullYear()} Papi Hair Design PRO. Všetky práva vyhradené.
            </div>
        </div>
      </div>
    </footer>
  )
}
