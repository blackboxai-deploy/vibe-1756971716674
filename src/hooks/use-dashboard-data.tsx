
"use client"

import * as React from "react"
import { collection, doc, getFirestore, writeBatch } from "firebase/firestore";
import type { Booking, Customer, Service, Stylist, Product } from "@/lib/types";
import { 
  initialBookings, 
  initialCustomers, 
  services as staticServices, 
  stylists as staticStylists,
  products as staticProducts
} from "@/lib/data";
import { 
  saveBooking as fbSaveBooking,
  deleteBooking as fbDeleteBooking,
  saveCustomer as fbSaveCustomer,
  deleteCustomer as fbDeleteCustomer,
  saveService as fbSaveService,
  deleteService as fbDeleteService,
  saveStylist as fbSaveStylist,
  deleteStylist as fbDeleteStylist,
  saveProduct as fbSaveProduct,
  deleteProduct as fbDeleteProduct,
  initializeFirebase,
  seedInitialData,
  onCollectionSnapshot
} from "@/lib/firebase";
import { useFirebase } from "./use-firebase";


interface DashboardDataContextType {
  bookings: Booking[];
  customers: Customer[];
  services: Service[];
  stylists: Stylist[];
  products: Product[];
  isLoading: boolean;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  updateBooking: (booking: Booking) => Promise<void>;
  deleteBooking: (bookingId: string) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'totalVisits' | 'totalSpent'>) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
  addStylist: (stylist: Omit<Stylist, 'id'>) => Promise<void>;
  updateStylist: (stylist: Stylist) => Promise<void>;
  deleteStylist: (stylistId: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

const DashboardDataContext = React.createContext<DashboardDataContextType | undefined>(undefined);

export function useDashboardData() {
  const context = React.useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardData must be used within a DashboardDataProvider");
  }
  return context;
}

export function DashboardDataProvider({ children }: { children: React.ReactNode }) {
  const { app, loading: firebaseLoading, user } = useFirebase();
  const [isLoading, setIsLoading] = React.useState(true);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [stylists, setStylists] = React.useState<Stylist[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const dataLoadedRef = React.useRef(false);

  React.useEffect(() => {
    if (app && user && !dataLoadedRef.current) {
      dataLoadedRef.current = true;
      initializeFirebase(app);

      const setupListeners = async () => {
        setIsLoading(true);
        // Seed data if collections are empty
        await seedInitialData(staticServices, initialCustomers, initialBookings, staticStylists, staticProducts);
        
        // Setup real-time listeners
        const unsubscribeBookings = onCollectionSnapshot<Booking>('bookings', setBookings);
        const unsubscribeCustomers = onCollectionSnapshot<Customer>('customers', setCustomers);
        const unsubscribeServices = onCollectionSnapshot<Service>('services', setServices);
        const unsubscribeStylists = onCollectionSnapshot<Stylist>('stylists', setStylists);
        const unsubscribeProducts = onCollectionSnapshot<Product>('products', setProducts);
        
        setIsLoading(false);

        // Cleanup listeners on component unmount
        return () => {
          unsubscribeBookings();
          unsubscribeCustomers();
          unsubscribeServices();
          unsubscribeStylists();
          unsubscribeProducts();
        };
      };
      
      setupListeners();
    } else if (!firebaseLoading && !user) {
        // If user is logged out, clear data and stop loading
        setBookings([]);
        setCustomers([]);
        setServices([]);
        setStylists([]);
        setProducts([]);
        setIsLoading(false);
        dataLoadedRef.current = false;
    }
  }, [app, firebaseLoading, user]);


  const getDb = () => {
    if (!app) throw new Error("Firebase not initialized");
    return getFirestore(app);
  }

  // --- Booking mutations ---
  const addBooking = async (booking: Omit<Booking, 'id'>) => {
    const newId = doc(collection(getDb(), 'bookings')).id;
    const newBooking = { ...booking, id: newId };
    await fbSaveBooking(newBooking);
  };

  const updateBooking = async (updatedBooking: Booking) => {
    await fbSaveBooking(updatedBooking);
  };

  const deleteBooking = async (bookingId: string) => {
    await fbDeleteBooking(bookingId);
  };
  
  // --- Customer mutations ---
  const addCustomer = async (customer: Omit<Customer, 'id' | 'totalVisits' | 'totalSpent'>) => {
    const newId = doc(collection(getDb(), 'customers')).id;
    const newCustomer: Customer = { ...customer, id: newId, totalVisits: 0, totalSpent: 0 };
    await fbSaveCustomer(newCustomer);
  };

  const updateCustomer = async (updatedCustomer: Customer) => {
    await fbSaveCustomer(updatedCustomer);
  };

  const deleteCustomer = async (customerId: string) => {
    await fbDeleteCustomer(customerId);
  };

  // --- Service mutations ---
  const addService = async (service: Omit<Service, 'id'>) => {
     const newId = doc(collection(getDb(), 'services')).id;
     const newService = { ...service, id: newId };
     await fbSaveService(newService);
  };

  const updateService = async (updatedService: Service) => {
    await fbSaveService(updatedService);
  };

  const deleteService = async (serviceId: string) => {
    await fbDeleteService(serviceId);
  };

  // --- Stylist mutations ---
  const addStylist = async (stylist: Omit<Stylist, 'id'>) => {
    const newId = doc(collection(getDb(), 'stylists')).id;
    const newStylist = { ...stylist, id: newId };
    await fbSaveStylist(newStylist);
  };

  const updateStylist = async (updatedStylist: Stylist) => {
    await fbSaveStylist(updatedStylist);
  };

  const deleteStylist = async (stylistId: string) => {
    await fbDeleteStylist(stylistId);
  };

  // --- Product mutations ---
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newId = doc(collection(getDb(), 'products')).id;
    const newProduct = { ...product, id: newId };
    await fbSaveProduct(newProduct);
  };

  const updateProduct = async (updatedProduct: Product) => {
    await fbSaveProduct(updatedProduct);
  };

  const deleteProduct = async (productId: string) => {
    await fbDeleteProduct(productId);
  };
  
  // Client-side calculation for customer stats
  const customersWithStats = React.useMemo(() => {
    if (!customers.length || !bookings.length || !services.length) return customers;

    const stats = new Map<string, { totalVisits: number, totalSpent: number }>();

    bookings.forEach(booking => {
        const currentStats = stats.get(booking.customerId) || { totalVisits: 0, totalSpent: 0 };
        const service = services.find(s => s.id === booking.serviceId);
        const price = service?.price || 0;
        stats.set(booking.customerId, {
            totalVisits: currentStats.totalVisits + 1,
            totalSpent: currentStats.totalSpent + price
        });
    });

    return customers.map(customer => {
        const customerStats = stats.get(customer.id);
        return {
            ...customer,
            totalVisits: customerStats?.totalVisits || 0,
            totalSpent: customerStats?.totalSpent || 0,
        };
    });
  }, [bookings, customers, services]);


  const value = {
    bookings,
    customers: customersWithStats,
    services,
    stylists,
    products,
    isLoading: isLoading || firebaseLoading,
    addBooking,
    updateBooking,
    deleteBooking,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addService,
    updateService,
    deleteService,
    addStylist,
    updateStylist,
    deleteStylist,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}
