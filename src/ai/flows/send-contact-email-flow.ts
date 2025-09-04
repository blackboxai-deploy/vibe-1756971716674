
'use server';

/**
 * @fileOverview A flow for handling contact form submissions.
 *
 * - sendContactEmail - A function that handles processing the contact form.
 * - SendContactEmailInput - The input type for the sendContactEmail function.
 * - SendContactEmailOutput - The return type for the sendContactEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { saveMessage } from '@/lib/firebase';
import type { ContactMessage } from '@/lib/types';
import { collection, doc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const SendContactEmailInputSchema = z.object({
  name: z.string().describe('The name of the person sending the message.'),
  email: z.string().email().describe('The email address of the sender.'),
  message: z.string().describe('The message content.'),
});
export type SendContactEmailInput = z.infer<typeof SendContactEmailInputSchema>;

const SendContactEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the message was sent successfully.'),
  message: z.string().describe('A confirmation message to the user.'),
});
export type SendContactEmailOutput = z.infer<typeof SendContactEmailOutputSchema>;

export async function sendContactEmail(input: SendContactEmailInput): Promise<SendContactEmailOutput> {
  return sendContactEmailFlow(input);
}

const sendContactEmailFlow = ai.defineFlow(
  {
    name: 'sendContactEmailFlow',
    inputSchema: SendContactEmailInputSchema,
    outputSchema: SendContactEmailOutputSchema,
  },
  async (input) => {
    try {
      // In a real app, this is where you'd save the message to a database.
      // We are now saving the message to Firestore.
      const db = getFirestore();
      const newId = doc(collection(db, 'messages')).id;

      const messageToSave: ContactMessage = {
        id: newId,
        ...input,
        createdAt: new Date(),
      };
      
      await saveMessage(messageToSave);

      return {
        success: true,
        message: `Ďakujeme, ${input.name}! Vaša správa bola úspešne odoslaná a uložená.`,
      };
    } catch (error) {
        console.error("Error saving message to Firestore:", error);
        return {
            success: false,
            message: "Ľutujeme, pri odosielaní správy sa vyskytla chyba."
        }
    }
  }
);
