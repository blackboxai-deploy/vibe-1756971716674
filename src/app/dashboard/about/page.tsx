
"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { Skeleton } from "@/components/ui/skeleton"

function TeamSkeleton() {
    return (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="text-center">
              <CardContent className="p-6">
                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
    )
}

const stylistImages: { [key: string]: string } = {
    'Papi': 'https://www.papihairdesign.sk/wp-content/uploads/2024/06/pucecka.jpg?w=1140&ssl=1',
    'Maťo': 'https://www.papihairdesign.sk/wp-content/uploads/2024/06/MATO_1.jpg?w=1140&ssl=1',
    'Miška': 'https://www.papihairdesign.sk/wp-content/uploads/2024/04/MISKA_1.jpg?w=1140&ssl=1'
}


export default function AboutPage() {
  const { stylists, isLoading } = useDashboardData()

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl">
          About Papi Hair Design PRO
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
          Welcome to our sanctuary of style. We are a team of passionate artists dedicated to the craft of hairdressing, where creativity and expertise combine to create unforgettable looks.
        </p>
      </section>
      
      <section>
         <Card>
            <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-3xl font-headline font-bold mb-4">Our Philosophy</h2>
                        <p className="text-muted-foreground mb-4">
                            At Papi Hair Design PRO, we believe that a great hairstyle is a work of art. It's an expression of your individuality and a reflection of your personal style. Our mission is to provide a personalized, luxurious experience for every client, ensuring you leave our salon feeling confident, refreshed, and beautiful.
                        </p>
                         <p className="text-muted-foreground">
                            We use only the highest quality products and stay at the forefront of the latest trends and techniques to bring you the very best in hair care and design.
                        </p>
                    </div>
                     <div className="relative aspect-square rounded-lg overflow-hidden">
                         <Image
                            src="https://www.papihairdesign.sk/wp-content/uploads/2024/04/P1000518-scaled.jpg?w=1140&ssl=1"
                            alt="Salon interior"
                            fill
                            className="object-cover"
                            data-ai-hint="modern salon"
                        />
                    </div>
                </div>
            </CardContent>
         </Card>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-headline font-bold">Meet Our Talented Team</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          The heart and soul of our salon. Get to know the artists behind the chairs.
        </p>
        {isLoading ? <TeamSkeleton /> : (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stylists.map((member) => (
                <Card key={member.name} className="text-center">
                <CardContent className="p-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={stylistImages[member.name] || `https://picsum.photos/100/100`} data-ai-hint="person portrait" />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-headline font-semibold">{member.name}</h3>
                    <p className="text-primary">Stylist</p>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
      </section>
    </div>
  )
}
