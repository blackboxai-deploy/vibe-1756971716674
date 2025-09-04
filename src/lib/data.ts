
import type { Service, Product, Stylist, Booking, Customer } from "@/lib/types";

// Note: These are now primarily used for seeding the database on first run.

export const services: Service[] = [
  { id: 'service-1', name: 'Pánsky Strih', duration: 45, price: 20, description: 'Umytie vlasov / Strih (nožnice/strojček) / Umytie vlasov / Styling.' },
  { id: 'service-2', name: 'Pánsky strih + Úprava brady', duration: 60, price: 25, description: 'Umytie vlasov / Strih / Úprava brady / Umytie vlasov a brady / Styling / Dezinfekcia po holení.' },
  { id: 'service-3', name: 'Dámske Strihanie', duration: 90, price: 30, description: 'Umytie vlasov / Strih / Vyfúkanie vlasov / Finálny styling.' },
  { id: 'service-4', name: 'Jednoduché Farbenie', duration: 120, price: 40, description: 'Farbenie korienkov / Vyfúkanie vlasov / Finálny Styling.' },
  { id: 'service-5', name: 'Zmena Farby Vlasov', duration: 240, price: 130, description: 'Rôzne techniky zosvetľovania (Melír, AirTouch, Balleyage) vrátane strihu a stylingu.' },
];

export const products: Product[] = [
  { id: "1", name: "Luxe Hydrating Shampoo", price: 35, imageUrl: "https://placehold.co/300x300.png", description: "Infused with argan oil.", dataAiHint: "shampoo bottle" },
  { id: "2", name: "Golden Argan Oil Serum", price: 55, imageUrl: "https://placehold.co/300x300.png", description: "For a brilliant shine.", dataAiHint: "serum bottle" },
  { id: "3", name: "Pro-Keratin Hair Mask", price: 45, imageUrl: "https://placehold.co/300x300.png", description: "Deeply repairs and strengthens.", dataAiHint: "cosmetic jar" },
  { id: "4", name: "Volumizing Mousse", price: 28, imageUrl: "https://placehold.co/300x300.png", description: "For lasting body and lift.", dataAiHint: "mousse can" },
  { id: "5", name: "Heat Protectant Spray", price: 32, imageUrl: "https://placehold.co/300x300.png", description: "Shields from styling damage.", dataAiHint: "spray bottle" },
  { id: "6", name: "Flexible Hold Hairspray", price: 30, imageUrl: "https://placehold.co/300x300.png", description: "Natural hold without stiffness.", dataAiHint: "hairspray can" },
];

export const stylists: Stylist[] = [
    { id: 'stylist-1', name: 'Papi', color: 'bg-sky-200 dark:bg-sky-800' },
    { id: 'stylist-2', name: 'Maťo', color: 'bg-amber-200 dark:bg-amber-800' },
    { id: 'stylist-3', name: 'Miška', color: 'bg-rose-200 dark:bg-rose-800' },
];

export const initialCustomers: Customer[] = [
  { id: 'customer-1', name: 'Zuzana Vzorová', email: 'zuzana.vzorova@email.com', phone: '0901 123 456', totalVisits: 0, totalSpent: 0 },
  { id: 'customer-2', name: 'Peter Novák', email: 'peter.novak@email.com', phone: '0902 234 567', totalVisits: 0, totalSpent: 0 },
  { id: 'customer-3', name: 'Eva Krátka', email: 'eva.kratka@email.com', phone: '0903 345 678', totalVisits: 0, totalSpent: 0 },
  { id: 'customer-4', name: 'Martin Dlhý', email: 'martin.dlhy@email.com', phone: '0904 456 789', totalVisits: 0, totalSpent: 0 },
];

const today = new Date();

// Helper to create a date by adding days and setting a specific time
const createDate = (daysToAdd: number, hour: number, minute: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysToAdd);
    date.setHours(hour, minute, 0, 0);
    return date;
};

export const initialBookings: Booking[] = [
  {
    id: "booking-1",
    customerId: "customer-1",
    customerName: "Zuzana Vzorová",
    serviceId: "service-3",
    serviceName: "Dámske Strihanie",
    startTime: createDate(0, 10, 0), // Today at 10:00
    duration: 90,
    stylistId: "stylist-3",
  },
  {
    id: "booking-2",
    customerId: "customer-2",
    customerName: "Peter Novák",
    serviceId: "service-1",
    serviceName: "Pánsky Strih",
    startTime: createDate(1, 14, 0), // Tomorrow at 14:00
    duration: 45,
    stylistId: "stylist-2",
  },
   {
    id: "booking-3",
    customerId: "customer-3",
    customerName: "Eva Krátka",
    serviceId: "service-4",
    serviceName: "Jednoduché Farbenie",
    startTime: createDate(0, 12, 0), // Today at 12:00
    duration: 120,
    stylistId: "stylist-1",
  },
   {
    id: "booking-4",
    customerId: "customer-4",
    customerName: "Martin Dlhý",
    serviceId: "service-2",
    serviceName: "Pánsky strih + Úprava brady",
    startTime: createDate(0, 16, 0), // Today at 16:00
    duration: 60,
    stylistId: "stylist-1",
  },
   {
    id: "booking-5",
    customerId: "customer-1",
    customerName: "Zuzana Vzorová",
    serviceId: "service-5",
    serviceName: "Zmena Farby Vlasov",
    startTime: createDate(-1, 11, 0), // Yesterday at 11:00
    duration: 240,
    stylistId: "stylist-2",
  },
];
