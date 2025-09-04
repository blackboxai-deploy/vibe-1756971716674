'use server';

/**
 * @fileOverview A flow for creating a booking from a natural language text input.
 *
 * - createBookingFromText - A function that handles parsing the text.
 * - CreateBookingFromTextInput - The input type for the function.
 * - CreateBookingFromTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CreateBookingFromTextInputSchema = z.object({
  query: z.string().describe('The natural language query for creating a booking. e.g., "Pánsky strih zajtra o 15:00 u Papiho"'),
});
export type CreateBookingFromTextInput = z.infer<typeof CreateBookingFromTextInputSchema>;

const CreateBookingFromTextOutputSchema = z.object({
  serviceName: z.string().optional().describe('The name of the service requested. e.g., "Pánsky strih"'),
  stylistName: z.string().optional().describe('The name of the stylist requested. e.g., "Papi"'),
  startTime: z.string().datetime().optional().describe("The requested start time for the booking in ISO 8601 format."),
});
export type CreateBookingFromTextOutput = z.infer<typeof CreateBookingFromTextOutputSchema>;


export async function createBookingFromText(input: CreateBookingFromTextInput): Promise<CreateBookingFromTextOutput> {
  return createBookingFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createBookingFromTextPrompt',
  input: { schema: CreateBookingFromTextInputSchema },
  output: { schema: CreateBookingFromTextOutputSchema },
  prompt: `You are an intelligent assistant for a hair salon. Your task is to parse a user's natural language request and extract booking information.

The current date and time is: ${new Date().toISOString()}

From the user's query, extract the following information:
1.  **serviceName**: Identify the name of the service requested.
2.  **stylistName**: Identify the name of the stylist requested. The available stylists are Papi, Maťo, and Miška.
3.  **startTime**: Determine the exact date and time for the appointment and provide it in a valid ISO 8601 datetime format. Correctly interpret relative terms like "zajtra" (tomorrow), "dnes" (today), "o hodinu" (in an hour), etc.

User Query: "{{query}}"

Return ONLY the JSON object with the extracted fields. If a field cannot be determined, omit it.`,
});


const createBookingFromTextFlow = ai.defineFlow(
  {
    name: 'createBookingFromTextFlow',
    inputSchema: CreateBookingFromTextInputSchema,
    outputSchema: CreateBookingFromTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Could not parse booking information from the text.");
    }
    return output;
  }
);
