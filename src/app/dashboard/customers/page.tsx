
"use client"

import * as React from "react"
import { PlusCircle, Search, MoreHorizontal, Trash2, Edit } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Customer } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import CustomerForm from "./customer-form"
import { useToast } from "@/hooks/use-toast"


function CustomerRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-10 mx-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-9 w-16 ml-auto" />
      </TableCell>
    </TableRow>
  )
}

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, isLoading } = useDashboardData();
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [customerToDelete, setCustomerToDelete] = React.useState<string | null>(null)
  const { toast } = useToast()

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleOpenForm = (customer: Customer | null) => {
    setSelectedCustomer(customer)
    setIsFormOpen(true)
  }

  const handleSaveCustomer = (customerData: Customer) => {
    if (customerData.id) {
      updateCustomer(customerData)
      toast({ title: "Zákazník aktualizovaný", description: "Údaje zákazníka boli úspešne uložené." })
    } else {
      addCustomer({ ...customerData, id: new Date().toISOString() })
      toast({ title: "Zákazník pridaný", description: "Nový zákazník bol úspešne pridaný do databázy." })
    }
    setIsFormOpen(false)
  }

  const confirmDelete = (customerId: string) => {
    setCustomerToDelete(customerId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteCustomer = () => {
    if (!customerToDelete) return;
    deleteCustomer(customerToDelete)
    toast({ title: "Zákazník zmazaný", description: "Zákazník bol úspešne odstránený." })
    setIsDeleteDialogOpen(false)
    setCustomerToDelete(null)
  }

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCustomer ? "Upraviť zákazníka" : "Nový zákazník"}</DialogTitle>
          </DialogHeader>
          <CustomerForm
            customer={selectedCustomer}
            onSave={handleSaveCustomer}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ste si istý?</AlertDialogTitle>
            <AlertDialogDescription>
              Túto akciu nie je možné vrátiť späť. Týmto sa zákazník natrvalo odstráni.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer}>Zmazať</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline">Zákazníci</CardTitle>
              <CardDescription>
                Spravujte svoju databázu zákazníkov.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenForm(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Pridať zákazníka
            </Button>
          </div>
          <div className="relative pt-4">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Hľadať zákazníkov..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meno</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead className="text-center">Návštevy</TableHead>
                <TableHead className="text-right">Minuté</TableHead>
                <TableHead className="text-right">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <CustomerRowSkeleton key={i} />)
              ) : (
                filteredCustomers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://placehold.co/40x40.png?text=${customer.name.charAt(0)}`} data-ai-hint="person avatar" />
                          <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{customer.email}</span>
                        <span className="text-muted-foreground">{customer.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{customer.totalVisits}</Badge>
                    </TableCell>
                    <TableCell className="text-right">€{customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Otvoriť menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Akcie</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenForm(customer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Upraviť
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete(customer.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Zmazať
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
