
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Service } from "@/lib/types"

const serviceFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Názov musí mať aspoň 2 znaky."),
  duration: z.coerce.number().min(5, "Trvanie musí byť aspoň 5 minút."),
  price: z.coerce.number().min(0, "Cena nemôže byť záporná."),
  description: z.string().min(10, "Popis musí mať aspoň 10 znakov."),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  service: Service | null;
  onSave: (data: Service) => void;
  onCancel: () => void;
}

export default function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service || { name: "", duration: 30, price: 20, description: "" },
  });

  React.useEffect(() => {
    reset(service || { name: "", duration: 30, price: 20, description: "" });
  }, [service, reset]);

  const onSubmit = (data: ServiceFormValues) => {
    onSave(data as Service);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Názov služby</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
       <div>
        <Label htmlFor="description">Popis</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Trvanie (v minútach)</Label>
          <Input id="duration" type="number" {...register("duration")} />
          {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
        </div>
        <div>
          <Label htmlFor="price">Cena (€)</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
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
