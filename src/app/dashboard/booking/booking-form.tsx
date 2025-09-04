
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { sk } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import type { Booking, Service, Customer, Stylist } from "@/lib/types";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const bookingFormSchema = z.object({
  customerId: z.string().min(1, "Prosím vyberte zákazníka."),
  serviceId: z.string().min(1, "Prosím vyberte službu."),
  stylistId: z.string().min(1, "Prosím vyberte stylistu."),
  startTime: z.date({
    required_error: "Dátum a čas sú povinné.",
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  services: Service[];
  customers: Customer[];
  stylists: Stylist[];
  booking?: Partial<Booking> | null;
  initialTime?: Date | null;
  onSave: (data: Booking) => void;
  onCancel: () => void;
  onDelete: (bookingId: string) => void;
}

export default function BookingForm({ services, customers, stylists, booking, initialTime, onSave, onCancel, onDelete }: BookingFormProps) {
    
  const defaultValues = React.useMemo(() => ({
    customerId: booking?.customerId || "",
    serviceId: booking?.serviceId || "",
    stylistId: booking?.stylistId || "",
    startTime: booking?.startTime || initialTime || new Date(),
  }), [booking, initialTime]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [booking, initialTime, reset, defaultValues]);

  const selectedServiceId = watch("serviceId");
  const selectedService = services.find(s => s.id === selectedServiceId);

  const onSubmit = (data: BookingFormValues) => {
    if (!selectedService) return;
    const customer = customers.find(c => c.id === data.customerId);
    if (!customer) return;
    
    const saveData: Booking = {
        id: booking?.id || new Date().toISOString(), // Create new ID if not exists
        customerId: data.customerId,
        customerName: customer.name,
        serviceId: data.serviceId,
        serviceName: selectedService.name,
        startTime: data.startTime,
        duration: selectedService.duration,
        stylistId: data.stylistId,
    };
    onSave(saveData);
  };
  
  const [customerPopoverOpen, setCustomerPopoverOpen] = React.useState(false);


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customerId">Zákazník</Label>
         <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
                <Popover open={customerPopoverOpen} onOpenChange={setCustomerPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={customerPopoverOpen}
                            className="w-full justify-between"
                        >
                            {field.value
                                ? customers.find((customer) => customer.id === field.value)?.name
                                : "Vyberte zákazníka..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Hľadať zákazníka..." />
                            <CommandEmpty>Nenašiel sa žiadny zákazník.</CommandEmpty>
                             <CommandList>
                                <CommandGroup>
                                    {customers.map((customer) => (
                                    <CommandItem
                                        value={customer.name}
                                        key={customer.id}
                                        onSelect={() => {
                                            setValue("customerId", customer.id)
                                            setCustomerPopoverOpen(false)
                                        }}
                                    >
                                        <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === customer.id ? "opacity-100" : "opacity-0"
                                        )}
                                        />
                                        {customer.name}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        />
        {errors.customerId && <p className="text-sm text-destructive">{errors.customerId.message}</p>}
      </div>


      <div className="space-y-2">
        <Label htmlFor="serviceId">Služba</Label>
        <Controller
          name="serviceId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte službu" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} ({service.duration} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
         {errors.serviceId && <p className="text-sm text-destructive">{errors.serviceId.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="stylistId">Stylista</Label>
        <Controller
          name="stylistId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte stylistu" />
              </SelectTrigger>
              <SelectContent>
                {stylists.map((stylist) => (
                  <SelectItem key={stylist.id} value={stylist.id}>
                    {stylist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
         {errors.stylistId && <p className="text-sm text-destructive">{errors.stylistId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Dátum a čas</Label>
        <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP HH:mm", { locale: sk }) : <span>Vyberte dátum</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            locale={sk}
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                                if (!date) return;
                                const newDate = field.value ? new Date(field.value) : new Date();
                                newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                                field.onChange(newDate);
                            }}
                            initialFocus
                        />
                         <div className="p-3 border-t border-border">
                            <Label>Čas</Label>
                            <Input
                                type="time"
                                value={field.value ? format(field.value, "HH:mm") : ""}
                                onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(':');
                                    const newDate = field.value ? new Date(field.value) : new Date();
                                    newDate.setHours(parseInt(hours), parseInt(minutes));
                                    field.onChange(newDate);
                                }}
                             />
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        />
        {errors.startTime && <p className="text-sm text-destructive">{errors.startTime.message}</p>}
      </div>


      {selectedService && (
        <div className="text-sm text-muted-foreground">
          <p>Trvanie: {selectedService.duration} minút</p>
          <p>Cena: €{selectedService.price}</p>
        </div>
      )}

      <div className="flex justify-between items-center gap-4 pt-4">
        <div>
            {booking && booking.id && (
            <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onDelete(booking.id!)}
            >
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Zmazať</span>
            </Button>
            )}
        </div>
        <div className="flex gap-4">
            <Button type="button" variant="ghost" onClick={onCancel}>
            Zrušiť
            </Button>
            <Button type="submit">Uložiť rezerváciu</Button>
        </div>
      </div>
    </form>
  );
}
