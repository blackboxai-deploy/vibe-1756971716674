
"use client"

import * as React from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Booking } from "@/lib/types";
import { useDashboardData } from "@/hooks/use-dashboard-data"

function RecentBookingSkeleton() {
    return (
        <div className="flex items-center">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="ml-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-5 w-16 ml-auto" />
        </div>
    )
}

interface RecentBookingsProps {
    isLoading?: boolean;
}
  
export default function RecentBookings({ isLoading }: RecentBookingsProps) {
    const { bookings, customers, services } = useDashboardData();

    const recentBookingsData = React.useMemo(() => {
        if (!bookings || !customers || !services) return [];
        return bookings
            .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
            .slice(0, 5)
            .map(booking => {
                const customer = customers.find(c => c.id === booking.customerId);
                const service = services.find(s => s.id === booking.serviceId);
                return {
                    name: customer?.name || "Neznámy zákazník",
                    email: customer?.email || "Bez emailu",
                    amount: `€${service?.price.toFixed(2) || '0.00'}`
                }
            });
    }, [bookings, customers, services]);

    return (
     <Card>
        <CardHeader>
            <CardTitle>Nedávne rezervácie</CardTitle>
            <CardDescription>
                Máte celkovo {bookings.length} rezervácií.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-8">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <RecentBookingSkeleton key={i} />)
                ) : (
                    recentBookingsData.map((booking, index) => (
                        <div className="flex items-center" key={index}>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={`https://placehold.co/40x40.png?text=${booking.name.charAt(0)}`} alt="Avatar" data-ai-hint="person avatar" />
                                <AvatarFallback>{booking.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{booking.name}</p>
                                <p className="text-sm text-muted-foreground">
                                {booking.email}
                                </p>
                            </div>
                            <div className="ml-auto font-medium">{booking.amount}</div>
                        </div>
                    ))
                )}
            </div>
        </CardContent>
    </Card>
  )
}
