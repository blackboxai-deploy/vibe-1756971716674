
"use client"

import * as React from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import ProductForm from "./product-form"
import { Skeleton } from "@/components/ui/skeleton"

function ProductCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="aspect-square relative">
            <Skeleton className="w-full h-full" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-8 w-1/4 mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}


function ProductCard({ 
  product, 
  onEdit, 
  onDelete 
}: { 
  product: Product,
  onEdit: (product: Product) => void,
  onDelete: (productId: string) => void 
}) {
  const { toast } = useToast()
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your shopping cart.`,
    })
  }
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative">
          <div className="aspect-square relative">
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover rounded-t-lg" data-ai-hint={product.dataAiHint || "hair product"} />
          </div>
          <div className="absolute top-2 right-2">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Upraviť
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => onDelete(product.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Zmazať
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
        <p className="text-2xl font-bold text-primary">€{product.price}</p>
        <CardDescription>{product.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, isLoading } = useDashboardData();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<string | null>(null);

  const handleOpenForm = (product: Product | null) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData && productData.id) {
      updateProduct(productData as Product);
      toast({ title: "Produkt aktualizovaný", description: "Produkt bol úspešne uložený." });
    } else {
      addProduct(productData);
      toast({ title: "Produkt pridaný", description: "Nový produkt bol úspešne pridaný." });
    }
    setIsFormOpen(false);
  };

  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete);
    toast({ title: "Produkt zmazaný", description: "Produkt bol úspešne odstránený." });
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Upraviť produkt" : "Nový produkt"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={selectedProduct}
            onSave={handleSaveProduct}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ste si istý?</AlertDialogTitle>
            <AlertDialogDescription>
              Túto akciu nie je možné vrátiť späť. Týmto sa produkt natrvalo odstráni.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>Zmazať</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div>
          <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-headline font-bold">Our Products</h1>
              <Button onClick={() => handleOpenForm(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Product
              </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              ) : (
                products.map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onEdit={handleOpenForm}
                      onDelete={confirmDelete}
                    />
                ))
              )}
          </div>
      </div>
    </>
  )
}
