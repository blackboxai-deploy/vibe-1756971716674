
"use client";

import * as React from "react";
import {
  Activity,
  DollarSign,
  Users,
  CreditCard,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import OverviewChart from "./overview-chart"
import RecentBookings from "./recent-bookings"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { isSameMonth } from "date-fns";

function StatCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-40 mt-1" />
            </CardContent>
        </Card>
    )
}

function OverviewChartSkeleton() {
    return (
        <Card className="xl:col-span-2">
            <CardHeader>
                <CardTitle>Prehľad</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <Skeleton className="w-full h-[350px]" />
            </CardContent>
        </Card>
    )
}

export default function Dashboard() {
  const { bookings, services, isLoading } = useDashboardData();
  
  const totalRevenue = React.useMemo(() => {
      if (!bookings || !services) return 0;
      return bookings.reduce((acc, booking) => {
          const service = services.find(s => s.id === booking.serviceId);
          return acc + (service?.price || 0);
      }, 0);
  }, [bookings, services]);

  const thisMonthBookingsCount = React.useMemo(() => {
      if (!bookings) return 0;
      const today = new Date();
      return bookings.filter(booking => isSameMonth(booking.startTime, today)).length;
  }, [bookings]);
  
  const productSales = 12234; // Placeholder
  const activeNow = 573; // Placeholder


  if (isLoading) {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-8">
          <OverviewChartSkeleton />
          <RecentBookings isLoading={true} />
        </div>
      </>
    )
  }

  return (
    <>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Celkové tržby
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                +20.1% z minulého mesiaca
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Rezervácie (Tento mesiac)
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+{thisMonthBookingsCount}</div>
                <p className="text-xs text-muted-foreground">
                +180.1% z minulého mesiaca
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Predaj produktov</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">€{productSales.toLocaleString('sk-SK')}</div>
                <p className="text-xs text-muted-foreground">
                +19% z minulého mesiaca
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktívni teraz</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+{activeNow}</div>
                <p className="text-xs text-muted-foreground">
                +201 od poslednej hodiny
                </p>
            </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-8">
            <Card className="xl:col-span-2">
            <CardHeader>
                <CardTitle>Prehľad</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <OverviewChart bookings={bookings} services={services} />
            </CardContent>
            </Card>
            <RecentBookings />
        </div>
    </>
  )
}
