
export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
}

export interface Product {
  id: string;
  name:string;
  price: number;
  imageUrl: string;
  description: string;
  dataAiHint?: string;
}

export interface Stylist {
  id: string;
  name: string;
  color: string; // e.g., 'bg-blue-200 dark:bg-blue-800'
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  startTime: Date;
  duration: number;
  stylistId: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalVisits: number;
    totalSpent: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}
