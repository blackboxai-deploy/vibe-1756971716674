"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatWithBot } from "@/ai/flows/ai-chatbot-integration";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { sk } from "date-fns/locale";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const welcomeMessage: Message = {
  role: "assistant",
  content: "Dobrý deň! Vitajte v Papi Hair Design PRO. Ako vám dnes môžem pomôcť? Môžete sa ma pýtať na služby, ceny alebo si pozrieť dostupné termíny v kalendári."
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector<HTMLDivElement>('div[style*="overflow: scroll"]');
        if (viewport) {
             viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);
  
  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setTimeout(() => setMessages([welcomeMessage]), 300);
    }
  };

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    if (messageContent === input) {
        setInput("");
    }
    setIsLoading(true);

    try {
      const result = await chatWithBot({ query: messageContent });
      const assistantMessage: Message = {
        role: "assistant",
        content: result.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Ospravedlňujeme sa, vyskytla sa chyba. Skúste to prosím neskôr.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const formattedDate = format(date, "d. MMMM yyyy", { locale: sk });
    const question = `Aké sú voľné termíny na ${formattedDate}?`;
    sendMessage(question);
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
          size="icon"
        >
          <Bot className="h-8 w-8" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2 font-headline">
            <Avatar className="h-8 w-8">
                <AvatarImage src="https://www.papihairdesign.sk/wp-content/uploads/2024/04/papihairdesign-logo.png" alt="Papi Hair Design Logo"/>
                <AvatarFallback>P</AvatarFallback>
            </Avatar>
            Chat s Papi Hair PRO
          </SheetTitle>
           <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                     <AvatarImage src="https://www.papihairdesign.sk/wp-content/uploads/2024/04/papihairdesign-logo.png" alt="Papi Hair Design Logo"/>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-xs md:max-w-md rounded-xl p-3 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                 <Avatar className="h-8 w-8">
                    <AvatarImage src="https://www.papihairdesign.sk/wp-content/uploads/2024/04/papihairdesign-logo.png" alt="Papi Hair Design Logo"/>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
                <div className="bg-card text-card-foreground rounded-xl p-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t space-y-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Opýtajte sa na termíny..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
           <div className="flex justify-center">
             <Calendar
                locale={sk}
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border p-2"
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
              />
           </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
