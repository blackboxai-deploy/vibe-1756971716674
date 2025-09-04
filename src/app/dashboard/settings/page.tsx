
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTheme } from "next-themes"
import { Moon, Sun, MoreHorizontal, Edit, Trash2, Bell } from "lucide-react"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import type { Service, Stylist } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import ServiceForm from "./service-form"
import StylistForm from "./stylist-form"
import { cn } from "@/lib/utils"


export default function SettingsPage() {
  const { setTheme } = useTheme()
  const { services, stylists, addService, updateService, deleteService, addStylist, updateStylist, deleteStylist } = useDashboardData()
  const { toast } = useToast()
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(false)

  React.useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setIsNotificationsEnabled(true)
      }
    }
  }, [])


  const handleNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({ variant: "destructive", title: "Chyba", description: "Tento prehliadač nepodporuje notifikácie." })
      return
    }

    if (Notification.permission === "granted") {
      toast({ title: "Notifikácie sú už povolené." })
      return
    }

    if (Notification.permission === "denied") {
      toast({ variant: "destructive", title: "Chyba", description: "Notifikácie boli zablokované. Povoľte ich v nastaveniach prehliadača." })
      return
    }

    const permission = await Notification.requestPermission()

    if (permission === "granted") {
      setIsNotificationsEnabled(true)
      toast({ title: "Notifikácie povolené!", description: "Budete dostávať upozornenia." })
    } else {
      toast({ title: "Povolenie zamietnuté", description: "Notifikácie nebudú odosielané." })
    }
  }


  const [isServiceFormOpen, setIsServiceFormOpen] = React.useState(false)
  const [selectedService, setSelectedService] = React.useState<Service | null>(null)
  const [isServiceDeleteDialogOpen, setIsServiceDeleteDialogOpen] = React.useState(false)
  const [serviceToDelete, setServiceToDelete] = React.useState<string | null>(null)
  
  const [isStylistFormOpen, setIsStylistFormOpen] = React.useState(false)
  const [selectedStylist, setSelectedStylist] = React.useState<Stylist | null>(null)
  const [isStylistDeleteDialogOpen, setIsStylistDeleteDialogOpen] = React.useState(false)
  const [stylistToDelete, setStylistToDelete] = React.useState<string | null>(null)

  const handleOpenServiceForm = (service: Service | null) => {
    setSelectedService(service)
    setIsServiceFormOpen(true)
  }

  const handleSaveService = (serviceData: Service) => {
    if (serviceData.id) {
      updateService(serviceData)
      toast({ title: "Služba aktualizovaná", description: "Údaje služby boli úspešne uložené." })
    } else {
      addService({ ...serviceData, id: new Date().toISOString() })
       toast({ title: "Služba pridaná", description: "Nová služba bola úspešne pridaná." })
    }
    setIsServiceFormOpen(false)
  }

  const confirmDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId)
    setIsServiceDeleteDialogOpen(true)
  }

  const handleDeleteService = () => {
    if (!serviceToDelete) return;
    deleteService(serviceToDelete)
    toast({ title: "Služba zmazaná", description: "Služba bola úspešne odstránená." })
    setIsServiceDeleteDialogOpen(false)
    setServiceToDelete(null)
  }
  
  const handleOpenStylistForm = (stylist: Stylist | null) => {
    setSelectedStylist(stylist);
    setIsStylistFormOpen(true);
  };

  const handleSaveStylist = (stylistData: Stylist) => {
    if (stylistData.id) {
      updateStylist(stylistData);
      toast({ title: "Stylista aktualizovaný", description: "Údaje stylistu boli úspešne uložené." });
    } else {
      addStylist({ ...stylistData, id: new Date().toISOString() });
      toast({ title: "Stylista pridaný", description: "Nový stylista bol úspešne pridaný." });
    }
    setIsStylistFormOpen(false);
  };
  
  const confirmDeleteStylist = (stylistId: string) => {
    setStylistToDelete(stylistId);
    setIsStylistDeleteDialogOpen(true);
  };

  const handleDeleteStylist = () => {
    if (!stylistToDelete) return;
    deleteStylist(stylistToDelete);
    toast({ title: "Stylista zmazaný", description: "Stylista bol úspešne odstránený." });
    setIsStylistDeleteDialogOpen(false);
    setStylistToDelete(null);
  };


  return (
    <>
      <Dialog open={isServiceFormOpen} onOpenChange={setIsServiceFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedService ? "Upraviť službu" : "Nová služba"}</DialogTitle>
          </DialogHeader>
          <ServiceForm
            service={selectedService}
            onSave={handleSaveService}
            onCancel={() => setIsServiceFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isServiceDeleteDialogOpen} onOpenChange={setIsServiceDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ste si istý?</AlertDialogTitle>
            <AlertDialogDescription>
              Túto akciu nie je možné vrátiť späť. Týmto sa služba natrvalo odstráni.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService}>Zmazať</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
       <Dialog open={isStylistFormOpen} onOpenChange={setIsStylistFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedStylist ? "Upraviť stylistu" : "Nový stylista"}</DialogTitle>
          </DialogHeader>
          <StylistForm
            stylist={selectedStylist}
            onSave={handleSaveStylist}
            onCancel={() => setIsStylistFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isStylistDeleteDialogOpen} onOpenChange={setIsStylistDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ste si istý?</AlertDialogTitle>
            <AlertDialogDescription>
              Túto akciu nie je možné vrátiť späť. Týmto sa stylista natrvalo odstráni.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStylist}>Zmazať</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5 md:w-[750px]">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="services">Služby</TabsTrigger>
          <TabsTrigger value="stylists">Stylisti</TabsTrigger>
          <TabsTrigger value="appearance">Vzhľad</TabsTrigger>
          <TabsTrigger value="notifications">Notifikácie</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Profil</CardTitle>
              <CardDescription>
                Spravujte nastavenia vášho účtu a osobné informácie.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Meno</Label>
                <Input id="name" defaultValue="Papi" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="papi@example.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Uložiť zmeny</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Služby</CardTitle>
              <CardDescription>
                Spravujte služby, ktoré váš salón ponúka.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Názov</TableHead>
                          <TableHead>Trvanie (min)</TableHead>
                          <TableHead>Cena</TableHead>
                          <TableHead className="text-right">Akcie</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {services.map(service => (
                          <TableRow key={service.id}>
                              <TableCell className="font-medium">{service.name}</TableCell>
                              <TableCell>{service.duration}</TableCell>
                              <TableCell>€{service.price}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Otvoriť menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenServiceForm(service)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Upraviť
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={() => confirmDeleteService(service.id)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Zmazať
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleOpenServiceForm(null)}>Pridať novú službu</Button>
            </CardFooter>
          </Card>
        </TabsContent>
         <TabsContent value="stylists">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Stylisti</CardTitle>
              <CardDescription>
                Spravujte svoj tím stylistov.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Meno</TableHead>
                          <TableHead>Farba v kalendári</TableHead>
                          <TableHead className="text-right">Akcie</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {stylists.map(stylist => (
                          <TableRow key={stylist.id}>
                              <TableCell className="font-medium">{stylist.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-4 h-4 rounded-full", stylist.color)}></div>
                                  <span>{stylist.color.replace('bg-', '').replace('dark:', ' / ')}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Otvoriť menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenStylistForm(stylist)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Upraviť
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={() => confirmDeleteStylist(stylist.id)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Zmazať
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleOpenStylistForm(null)}>Pridať nového stylistu</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Vzhľad</CardTitle>
              <CardDescription>
                Prispôsobte si vzhľad a dojem z vašej aplikácie.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Téma</Label>
              <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => setTheme('light')}>
                      <Sun className="mr-2 h-4 w-4" />
                      Svetlá
                  </Button>
                  <Button variant="outline" onClick={() => setTheme('dark')}>
                      <Moon className="mr-2 h-4 w-4" />
                      Tmavá
                  </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Notifikácie</CardTitle>
              <CardDescription>
                Spravujte nastavenia push notifikácií pre dôležité udalosti, ako sú nové rezervácie alebo pripomienky.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">Povoliť Push Notifikácie</h4>
                        <p className="text-sm text-muted-foreground">
                            {isNotificationsEnabled ? "Notifikácie sú aktívne." : "Dostávajte upozornenia priamo na vaše zariadenie."}
                        </p>
                    </div>
                    <Button onClick={handleNotificationPermission} disabled={isNotificationsEnabled}>
                        <Bell className="mr-2 h-4 w-4" />
                        {isNotificationsEnabled ? "Povolené" : "Povoliť"}
                    </Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
