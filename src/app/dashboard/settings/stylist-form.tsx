
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Stylist } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const stylistFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Meno musí mať aspoň 2 znaky."),
  color: z.string().min(1, "Prosím vyberte farbu."),
});

type StylistFormValues = z.infer<typeof stylistFormSchema>;

interface StylistFormProps {
  stylist: Stylist | null;
  onSave: (data: Stylist) => void;
  onCancel: () => void;
}

const colorOptions = [
    { value: 'bg-sky-200 dark:bg-sky-800', label: 'Sky' },
    { value: 'bg-amber-200 dark:bg-amber-800', label: 'Amber' },
    { value: 'bg-rose-200 dark:bg-rose-800', label: 'Rose' },
    { value: 'bg-emerald-200 dark:bg-emerald-800', label: 'Emerald' },
    { value: 'bg-violet-200 dark:bg-violet-800', label: 'Violet' },
    { value: 'bg-gray-200 dark:bg-gray-600', label: 'Gray' },
]

export default function StylistForm({ stylist, onSave, onCancel }: StylistFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StylistFormValues>({
    resolver: zodResolver(stylistFormSchema),
    defaultValues: stylist || { name: "", color: "" },
  });

  React.useEffect(() => {
    reset(stylist || { name: "", color: "" });
  }, [stylist, reset]);

  const onSubmit = (data: StylistFormValues) => {
    onSave(data as Stylist);
  };

  const selectedColor = watch("color");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Meno</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="color">Farba v kalendári</Label>
        <Select onValueChange={(value) => setValue('color', value)} value={selectedColor}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte farbu...">
                    {selectedColor && (
                         <div className="flex items-center gap-2">
                           <div className={cn("w-4 h-4 rounded-full", selectedColor)}></div>
                           <span>{colorOptions.find(c => c.value === selectedColor)?.label}</span>
                         </div>
                    )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded-full", option.value)}></div>
                        <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
        </Select>
        {errors.color && <p className="text-sm text-destructive">{errors.color.message}</p>}
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
