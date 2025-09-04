'use server';
/**
 * @fileOverview A tool for checking booking availability.
 * This tool can be used by an AI agent to query for open appointment slots.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// This is a simplified, simulated database of existing bookings.
// In a real application, this would query a proper database.
const existingBookings = [
    { date: '2024-08-15', time: '10:00', duration: 60 },
    { date: '2024-08-15', time: '14:00', duration: 120 },
    { date: '2024-08-16', time: '11:00', duration: 45 },
];

export const checkAvailability = ai.defineTool(
  {
    name: 'checkAvailability',
    description: 'Check for available appointment times on a specific date.',
    inputSchema: z.object({
      date: z.string().describe("The date to check for availability, in 'YYYY-MM-DD' format."),
    }),
    outputSchema: z.object({
        availableSlots: z.array(z.string()).describe("A list of available start times in 'HH:mm' format."),
    })
  },
  async (input) => {
    // Simulate checking for available slots
    console.log(`Checking availability for: ${input.date}`);

    // Opening hours
    const openingTime = 8; // 8 AM
    const closingTime = 17; // 5 PM
    const allPossibleSlots: string[] = [];

    for (let hour = openingTime; hour < closingTime; hour++) {
        allPossibleSlots.push(`${String(hour).padStart(2, '0')}:00`);
        allPossibleSlots.push(`${String(hour).padStart(2, '0')}:30`);
    }
    
    // Filter out booked slots
    const bookedSlotsForDay = existingBookings
        .filter(b => new Date(b.date).toISOString().split('T')[0] === new Date(input.date).toISOString().split('T')[0])
        .map(b => b.time);
    
    const availableSlots = allPossibleSlots.filter(slot => !bookedSlotsForDay.includes(slot));

    return { availableSlots };
  }
);
