import { config } from 'dotenv';
config();

import '@/ai/flows/ai-chatbot-integration.ts';
import '@/ai/flows/send-contact-email-flow.ts';
import '@/ai/tools/booking-tool.ts';
import '@/ai/flows/create-booking-from-text-flow.ts';
