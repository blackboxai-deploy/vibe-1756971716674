
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/lib/types"

const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Názov musí mať aspoň 2 znaky."),
  price: z.coerce.number().min(0, "Cena nemôže byť záporná."),
  description: z.string().min(10, "Popis musí mať aspoň 10 znakov."),
  imageUrl: z.string().url("Prosím zadajte platnú URL adresu obrázka."),
  dataAiHint: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product: Product | null;
  onSave: (data: Omit<Product, 'id'> | Product) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product || { name: "", price: 0, description: "", imageUrl: "" },
  });

  React.useEffect(() => {
    reset(product || { name: "", price: 0, description: "", imageUrl: "" });
  }, [product, reset]);

  const onSubmit = (data: ProductFormValues) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Názov produktu</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
       <div>
        <Label htmlFor="description">Popis</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>
      <div>
        <Label htmlFor="price">Cena (€)</Label>
        <Input id="price" type="number" step="0.01" {...register("price")} />
        {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
      </div>
       <div>
        <Label htmlFor="imageUrl">URL obrázka</Label>
        <Input id="imageUrl" {...register("imageUrl")} />
        {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
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
