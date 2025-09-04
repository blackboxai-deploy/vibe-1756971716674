
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useMemo } from "react";
import type { Booking, Service } from "@/lib/types";

interface OverviewChartProps {
    bookings: Booking[];
    services: Service[];
}

export default function OverviewChart({ bookings, services }: OverviewChartProps) {
  const data = useMemo(() => {
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString('sk-SK', { month: 'short' }),
      total: 0,
    }));

    bookings.forEach(booking => {
      const month = booking.startTime.getMonth();
      const service = services.find(s => s.id === booking.serviceId);
      if (service) {
        monthlyRevenue[month].total += service.price;
      }
    });

    // Capitalize first letter of month name
    monthlyRevenue.forEach(month => {
      month.name = month.name.charAt(0).toUpperCase() + month.name.slice(1);
    });

    return monthlyRevenue;
  }, [bookings, services]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `€${value}`}
        />
        <Bar
          dataKey="total"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
