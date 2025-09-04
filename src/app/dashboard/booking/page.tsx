"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { addDays, format, startOfWeek, subDays, addMinutes, areIntervalsOverlapping, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths, isSameDay, startOfDay, endOfDay } from "date-fns";
import { sk } from 'date-fns/locale';
import BookingForm from "./booking-form";
import type { Booking } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import TodoList from "./todo-list";
import type { ParsedBookingData } from "@/components/quick-add-dialog";
import { useDashboardData } from "@/hooks/use-dashboard-data";

const timeSlots = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 8; // 8 AM to 6 PM
  return `${hour.toString().padStart(2, "0")}:00`;
});

type ViewMode = 'day' | 'week' | 'month' | 'agenda';

function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-[200px]" />
            </div>
            <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-36" />
            </div>
        </div>
        <div className="flex-1 border rounded-lg p-4">
            <div className="grid grid-cols-8 h-full">
            <div className="col-span-1 space-y-2">
                <Skeleton className="h-12" />
                {timeSlots.map(time => <Skeleton key={time} className="h-16" />)}
            </div>
            <div className="col-span-7 grid grid-cols-7 ml-2 space-x-2">
                {Array.from({length: 7}).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-12" />
                    {timeSlots.map(time => <Skeleton key={time} className="h-16" />)}
                </div>
                ))}
            </div>
            </div>
        </div>
      </div>
       <div className="lg:col-span-1">
         <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-6 w-10" />
                    </div>
                ))}
                <Skeleton className="h-10 w-full" />
            </CardContent>
         </Card>
       </div>
    </div>
  )
}

export default function BookingPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Partial<Booking> | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<Date | null>(null);
  const { toast } = useToast();
  const [stylistFilter, setStylistFilter] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<ViewMode>('week');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [bookingToDelete, setBookingToDelete] = React.useState<string | null>(null);
  const { 
    bookings, 
    customers, 
    services, 
    stylists, 
    addBooking, 
    updateBooking, 
    deleteBooking, 
    isLoading 
  } = useDashboardData();

  React.useEffect(() => {
    const handleQuickAdd = (e: CustomEvent<{ parsedData: ParsedBookingData }>) => {
      const { parsedData } = e.detail;
      
      const newStartTime = parsedData.startTime ? new Date(parsedData.startTime) : new Date();

      const foundService = services.find(s => s.name.toLowerCase() === parsedData.serviceName?.toLowerCase());
      const foundStylist = stylists.find(s => s.name.toLowerCase() === parsedData.stylistName?.toLowerCase());
      
      const bookingStub: Partial<Booking> = {
        serviceId: foundService?.id || '',
        stylistId: foundStylist?.id || '',
        startTime: newStartTime,
      };
      
      setSelectedBooking(bookingStub);
      setSelectedTimeSlot(newStartTime);
      setIsFormOpen(true);
    };

    window.addEventListener('quickadd-parsed', handleQuickAdd as EventListener);
    return () => {
        window.removeEventListener('quickadd-parsed', handleQuickAdd as EventListener);
    };
  }, [services, stylists]);


  const weekStartsOn = 1; // Monday
  const startOfView = startOfWeek(currentDate, { weekStartsOn, locale: sk });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfView, i));
  const monthDays = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
  
  const getFirstDayOfMonth = () => {
    const day = getDay(startOfMonth(currentDate));
    // Sunday is 0, so we shift it to 6 to be the last day of the week
    return day === 0 ? 6 : day - 1; 
  };
  const emptyDays = Array.from({ length: getFirstDayOfMonth() });


  const hasConflict = (newBooking: Booking, existingBookingId?: string): boolean => {
    const newBookingEnd = addMinutes(newBooking.startTime, newBooking.duration);
    
    for (const booking of bookings) {
        if (existingBookingId && booking.id === existingBookingId) continue;
        if (booking.stylistId !== newBooking.stylistId) continue;

        if (areIntervalsOverlapping(
            { start: newBooking.startTime, end: newBookingEnd },
            { start: booking.startTime, end: addMinutes(booking.startTime, booking.duration) },
            { inclusive: false }
        )) {
            toast({ 
                variant: "destructive", 
                title: "Konflikt Rezervácií", 
                description: `Stylista ${stylists.find(s => s.id === newBooking.stylistId)?.name} je už v tomto čase zaneprázdnený.` 
            });
            return true;
        }
    }
    return false;
  };

  const handlePrev = () => {
    if (viewMode === 'day') setCurrentDate(subDays(currentDate, 1));
    if (viewMode === 'week') setCurrentDate(subDays(currentDate, 7));
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    if (viewMode === 'agenda') setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
    if (viewMode === 'week') setCurrentDate(addDays(currentDate, 7));
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
     if (viewMode === 'agenda') setCurrentDate(addDays(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleSaveBooking = (bookingData: Booking) => {
    if (selectedBooking && selectedBooking.id) { // Editing
        if (hasConflict(bookingData, selectedBooking.id)) {
            return;
        }
      updateBooking(bookingData);
      toast({ title: "Rezervácia aktualizovaná", description: "Rezervácia bola úspešne aktualizovaná." });
    } else { // Creating new
       if (hasConflict(bookingData)) {
            return;
        }
       addBooking(bookingData);
       toast({ title: "Rezervácia vytvorená", description: "Nová rezervácia bola úspešne pridaná." });
    }
    setIsFormOpen(false);
    setSelectedBooking(null);
  };
  
  const handleDeleteBooking = () => {
    if (!bookingToDelete) return;
    deleteBooking(bookingToDelete);
    toast({ title: "Rezervácia zmazaná", description: "Rezervácia bola úspešne zmazaná." });
    setIsDeleteDialogOpen(false);
    setBookingToDelete(null);
    setIsFormOpen(false);
    setSelectedBooking(null);
  };

  const confirmDelete = (bookingId: string) => {
    setBookingToDelete(bookingId);
    setIsDeleteDialogOpen(true);
  }

  const openBookingForm = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedTimeSlot(null);
    setIsFormOpen(true);
  }

  const openNewBookingForm = () => {
    setSelectedBooking(null);
    setSelectedTimeSlot(new Date()); // Default to now
    setIsFormOpen(true);
  }
  
  const openQuickBookingForm = (day: Date, time: string) => {
    setSelectedBooking(null);
    const startTime = new Date(day);
    const [hours, minutes] = time.split(':');
    startTime.setHours(parseInt(hours), parseInt(minutes));
    setSelectedTimeSlot(startTime);
    setIsFormOpen(true);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, bookingId: string) => {
    e.dataTransfer.setData("bookingId", bookingId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: Date, time: string) => {
    e.preventDefault();
    const bookingId = e.dataTransfer.getData("bookingId");
    const bookingToMove = bookings.find(b => b.id === bookingId);

    if (bookingToMove) {
        const newStartTime = new Date(day);
        const [hours, minutes] = time.split(':');
        newStartTime.setHours(parseInt(hours), parseInt(minutes));
        
        const potentialNewBooking: Booking = { ...bookingToMove, startTime: newStartTime };

        if (hasConflict(potentialNewBooking, bookingId)) {
            return;
        }
        
        updateBooking(potentialNewBooking);
        toast({ title: "Rezervácia presunutá", description: "Termín bol úspešne zmenený." });
    }
  };
  
  const filteredBookings = bookings.filter(b => stylistFilter === 'all' || b.stylistId === stylistFilter);
  
  const renderTitle = () => {
    if (viewMode === 'day' || viewMode === 'agenda') return format(currentDate, "d. MMMM yyyy", { locale: sk });
    if (viewMode === 'week') return `${format(startOfView, "d. MMMM", { locale: sk })} - ${format(addDays(startOfView, 6), "d. MMMM yyyy", { locale: sk })}`;
    if (viewMode === 'month') return format(currentDate, "MMMM yyyy", { locale: sk });
  }

  const renderDayView = () => (
    <div className="grid grid-cols-[auto_1fr] flex-1 border-t border-l overflow-y-auto">
      {/* Time column */}
      <div className="col-start-1">
        <div className="h-12 border-b border-r sticky top-0 bg-background z-10"></div>
        {timeSlots.map(time => (
          <div key={time} className="h-16 border-b border-r text-center text-xs text-muted-foreground p-1 w-16 relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2">{time}</span>
          </div>
        ))}
      </div>
  
      {/* Day column */}
      <div className="col-start-2 relative">
        <div className="h-12 border-b border-r text-center p-2 sticky top-0 bg-background z-20">
          <p className="font-semibold text-sm">{format(currentDate, "eee", { locale: sk })}</p>
          <p className="text-2xl font-bold">{format(currentDate, "d")}</p>
        </div>
        {/* Clickable Grid for new bookings */}
        <div className="absolute inset-0 z-0">
          {timeSlots.map(time => (
            <div 
              key={time} 
              className="h-16 border-b border-r hover:bg-accent transition-colors cursor-pointer"
              onClick={() => openQuickBookingForm(currentDate, time)}
            />
          ))}
        </div>
        
        {/* Render Bookings */}
        {filteredBookings.filter(b => isSameDay(b.startTime, currentDate)).map(booking => {
          const top = (booking.startTime.getHours() - 8 + booking.startTime.getMinutes() / 60) * 64 + 48; // 64px per hour, 48px offset for header
          const height = (booking.duration / 60) * 64;
          const stylist = stylists.find(s => s.id === booking.stylistId);
          return (
            <Card 
              key={booking.id}
              className={cn(
                "absolute z-10 p-2 text-foreground cursor-pointer rounded-lg border",
                stylist?.color
              )}
              style={{ top: `${top}px`, height: `${height}px`, left: '2px', right: '2px' }}
              onClick={(e) => {e.stopPropagation(); openBookingForm(booking)}}
            >
              <p className="text-xs font-bold truncate">{booking.serviceName}</p>
              <p className="text-xs truncate">{booking.customerName}</p>
              <p className="text-xs truncate">{stylist?.name}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
  
  const renderWeekView = () => (
    <div className="grid grid-cols-[auto_1fr] flex-1 border-t border-l overflow-auto">
      {/* Time column */}
      <div className="col-start-1 row-start-2 sticky left-0 bg-background z-10">
        {timeSlots.map(time => (
          <div key={time} className="h-16 border-b border-r text-center text-xs text-muted-foreground p-1 flex items-center justify-center w-16">
            <span>{time}</span>
          </div>
        ))}
      </div>
  
      {/* Header row */}
      <div className="col-start-2 row-start-1 grid grid-cols-7 sticky top-0 bg-background z-20 border-b">
        {weekDays.map(day => (
          <div key={day.toISOString()} className="h-auto border-r text-center p-2">
            <p className="font-semibold text-sm">{format(day, "eee", { locale: sk })}</p>
            <p className={cn("text-2xl font-bold", isSameDay(day, new Date()) && "text-primary")}>{format(day, "d")}</p>
          </div>
        ))}
      </div>
      
      {/* Grid content */}
      <div className="col-start-2 row-start-2 grid grid-cols-7">
        {weekDays.map(day => (
          <div key={day.toString()} className="col-span-1 relative border-r">
            {/* Clickable Grid for new bookings */}
            <div className="absolute inset-0 z-0">
              {timeSlots.map(time => (
                <div 
                  key={time} 
                  className="h-16 border-b hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => openQuickBookingForm(day, time)}
                />
              ))}
            </div>
            
            {/* Render Bookings */}
            {filteredBookings.filter(b => isSameDay(b.startTime, day)).map(booking => {
              const top = (booking.startTime.getHours() - 8 + booking.startTime.getMinutes() / 60) * 64; // 64px per hour
              const height = (booking.duration / 60) * 64;
              const stylist = stylists.find(s => s.id === booking.stylistId);
              return (
                <Card 
                  key={booking.id}
                  className={cn(
                    "absolute z-10 p-2 text-foreground cursor-pointer rounded-lg border",
                    stylist?.color
                  )}
                  style={{ top: `${top}px`, height: `${height}px`, left: '2px', right: '2px' }}
                  onClick={(e) => {e.stopPropagation(); openBookingForm(booking)}}
                >
                  <p className="text-xs font-bold truncate">{booking.serviceName}</p>
                  <p className="text-xs truncate">{booking.customerName}</p>
                </Card>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonthView = () => (
      <div className="flex-1 border-t overflow-auto">
          <div className="grid grid-cols-7 sticky top-0 bg-background z-10">
              {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map(day => (
                  <div key={day} className="text-center font-bold p-2 border-b border-r text-muted-foreground text-sm">{day}</div>
              ))}
          </div>
          <div className="grid grid-cols-7" style={{ minHeight: 'calc(100% - 41px)' }}>
              {emptyDays.map((_, i) => <div key={`empty-${i}`} className="border-b border-r bg-muted/50"></div>)}
              {monthDays.map(day => {
                  const bookingsOnDay = filteredBookings
                    .filter(b => isSameDay(b.startTime, day))
                    .sort((a,b) => a.startTime.getTime() - b.startTime.getTime());
                  return (
                      <div key={day.toString()} className="h-32 border-b border-r p-1 overflow-y-auto" onClick={() => { setCurrentDate(day); setViewMode('day'); }}>
                           <p className={cn("font-bold text-right pr-2", isSameDay(day, new Date()) && "text-primary")}>{format(day, "d")}</p>
                           <div className="space-y-1 mt-1">
                               {bookingsOnDay.slice(0, 3).map(booking => {
                                   const stylist = stylists.find(s => s.id === booking.stylistId);
                                   return (
                                       <div key={booking.id} 
                                            className={cn("p-1 rounded text-foreground text-xs cursor-pointer border", stylist?.color)}
                                            onClick={(e) => { e.stopPropagation(); openBookingForm(booking); }}
                                        >
                                           <p className="font-semibold truncate">{format(booking.startTime, "HH:mm")} {booking.serviceName}</p>
                                       </div>
                                   )
                               })}
                               {bookingsOnDay.length > 3 && <p className="text-xs text-muted-foreground mt-1">+ {bookingsOnDay.length - 3} ďalšie</p>}
                           </div>
                      </div>
                  )
              })}
          </div>
      </div>
  );

  const renderAgendaView = () => {
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);
    const bookingsForAgenda = filteredBookings
        .filter(b => b.startTime >= dayStart && b.startTime <= dayEnd)
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
             {bookingsForAgenda.length > 0 ? bookingsForAgenda.map(booking => {
                 const stylist = stylists.find(s => s.id === booking.stylistId);
                 return (
                    <Card key={booking.id} onClick={() => openBookingForm(booking)} className="cursor-pointer hover:bg-accent transition-colors">
                        <CardContent className="p-4 flex items-center gap-4">
                             <div className={cn("w-2 h-16 rounded-full", stylist?.color)}></div>
                             <div className="flex-1">
                                <p className="font-bold">{booking.serviceName}</p>
                                <p className="text-sm text-muted-foreground">{booking.customerName}</p>
                                <p className="text-sm text-muted-foreground">{stylist?.name}</p>
                             </div>
                             <div>
                                <p className="font-bold text-lg">{format(booking.startTime, "HH:mm")}</p>
                                <p className="text-sm text-muted-foreground">{booking.duration} min</p>
                             </div>
                        </CardContent>
                    </Card>
                 )
             }) : (
                <div className="text-center text-muted-foreground py-16">
                    <p>Na tento deň nie sú naplánované žiadne rezervácie.</p>
                </div>
             )}
        </div>
    )
  };


  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedBooking?.id ? 'Upraviť rezerváciu' : 'Nová rezervácia'}</DialogTitle>
          </DialogHeader>
          <BookingForm 
            services={services} 
            customers={customers}
            stylists={stylists}
            onSave={handleSaveBooking} 
            onCancel={() => setIsFormOpen(false)}
            onDelete={confirmDelete}
            booking={selectedBooking}
            initialTime={selectedTimeSlot}
           />
        </DialogContent>
      </Dialog>
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ste si istý?</AlertDialogTitle>
            <AlertDialogDescription>
              Túto akciu nie je možné vrátiť späť. Týmto sa rezervácia natrvalo odstráni.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBooking}>Zmazať</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="lg:col-span-2 flex flex-col h-[calc(100vh_-_120px)]">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4 p-1">
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={goToToday}>Dnes</Button>
                <Button variant="outline" size="icon" onClick={handlePrev}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-headline font-bold ml-2">
                    {renderTitle()}
                </h2>
                <div className="w-[200px] ml-4">
                <Select value={stylistFilter} onValueChange={setStylistFilter}>
                    <SelectTrigger>
                    <SelectValue placeholder="Filtrovať podľa zamestnanca" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">Všetci stylisti</SelectItem>
                    {stylists.map(stylist => (
                        <SelectItem key={stylist.id} value={stylist.id}>{stylist.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant={viewMode === 'day' ? 'default' : 'outline'} onClick={() => setViewMode('day')}>Deň</Button>
                <Button variant={viewMode === 'week' ? 'default' : 'outline'} onClick={() => setViewMode('week')}>Týždeň</Button>
                <Button variant={viewMode === 'month' ? 'default' : 'outline'} onClick={() => setViewMode('month')}>Mesiac</Button>
                <Button variant={viewMode === 'agenda' ? 'default' : 'outline'} onClick={() => setViewMode('agenda')}>Agenda</Button>
                <Button onClick={openNewBookingForm} className="ml-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Nová rezervácia
                </Button>
            </div>
        </div>
        
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'agenda' && renderAgendaView()}
      </div>

       <div className="lg:col-span-1">
            <TodoList />
       </div>
    </div>
  );
}
