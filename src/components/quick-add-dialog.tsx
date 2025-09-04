"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createBookingFromText, CreateBookingFromTextOutput } from "@/ai/flows/create-booking-from-text-flow"
import { Loader2, Zap } from "lucide-react"

export type ParsedBookingData = CreateBookingFromTextOutput;

declare global {
  interface WindowEventMap {
    'open-quick-add': CustomEvent;
    'quickadd-parsed': CustomEvent<{ parsedData: ParsedBookingData }>;
  }
}

interface QuickAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickAddDialog({ open, onOpenChange }: QuickAddDialogProps) {
  const [text, setText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleOpen = () => onOpenChange(true);
    window.addEventListener('open-quick-add', handleOpen);
    return () => window.removeEventListener('open-quick-add', handleOpen);
  }, [onOpenChange]);

  React.useEffect(() => {
    if (open) {
        // Focus input when dialog opens
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleParse = async () => {
    if (!text.trim()) return;
    setIsLoading(true);

    try {
      const parsedData = await createBookingFromText({ query: text });
      
      const event = new CustomEvent('quickadd-parsed', { detail: { parsedData } });
      window.dispatchEvent(event);

      toast({
        title: "Text spracovaný!",
        description: "Formulár bol predvyplnený. Skontrolujte prosím údaje.",
      });
      onOpenChange(false);
      setText("");
    } catch (error) {
      console.error("Failed to parse booking text:", error);
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Nepodarilo sa spracovať text. Skúste to prosím znova.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleParse();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Zap className="h-5 w-5 text-primary" />
            Quick Add
          </DialogTitle>
          <DialogDescription>
            Napíšte požiadavku na rezerváciu. AI ju automaticky spracuje.
             Napr. "Pánsky strih zajtra o 15:00 u Papiho".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            ref={inputRef}
            placeholder="Zadajte text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Zrušiť
          </Button>
          <Button onClick={handleParse} disabled={isLoading || !text.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Spracovávam...
              </>
            ) : (
              "Spracovať text"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
