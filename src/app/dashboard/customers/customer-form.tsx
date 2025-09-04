
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Customer } from "@/lib/types"

const customerFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Meno musí mať aspoň 2 znaky."),
  email: z.string().email("Prosím zadajte platný email."),
  phone: z.string().min(10, "Telefónne číslo musí mať aspoň 10 znakov."),
  totalVisits: z.number().optional().default(0),
  totalSpent: z.number().optional().default(0),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface CustomerFormProps {
  customer: Customer | null;
  onSave: (data: Customer) => void;
  onCancel: () => void;
}

export default function CustomerForm({ customer, onSave, onCancel }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer || { name: "", email: "", phone: "" },
  });

  React.useEffect(() => {
    reset(customer || { name: "", email: "", phone: "" });
  }, [customer, reset]);

  const onSubmit = (data: CustomerFormValues) => {
    onSave(data as Customer);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Meno</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="phone">Telefón</Label>
        <Input id="phone" {...register("phone")} />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Zrušiť
        </Button>
        <Button type="submit">Uložiť</Button>
      </div>
    </form>
  );
}
