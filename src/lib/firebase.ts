
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  query,
  Timestamp,
  onSnapshot,
  type Unsubscribe,
  DocumentData,
} from 'firebase/firestore';
import type { Booking, ContactMessage, Customer, Service, Stylist, Product } from '@/lib/types';
import type { FirebaseApp } from 'firebase/app';

let db: any;

export const initializeFirebase = (app: FirebaseApp) => {
  if (!db) {
    db = getFirestore(app);
  }
};

const getCollectionData = async <T>(collectionName: string): Promise<T[]> => {
  if (!db) {
    console.error('Firestore is not initialized.');
    return [];
  }
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => {
    const docData = doc.data() as DocumentData;
    // Convert Firestore Timestamps to JS Date objects
    for (const key in docData) {
      if (docData[key] instanceof Timestamp) {
        docData[key] = docData[key].toDate();
      }
    }
    return { id: doc.id, ...docData } as T;
  });
  return data;
};

export const onCollectionSnapshot = <T>(
    collectionName: string,
    callback: (data: T[]) => void
): Unsubscribe => {
    if (!db) {
        console.error('Firestore is not initialized.');
        return () => {};
    }
    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
             const docData = doc.data() as DocumentData;
            for (const key in docData) {
                if (docData[key] instanceof Timestamp) {
                    docData[key] = docData[key].toDate();
                }
            }
            return { id: doc.id, ...docData } as T;
        });
        callback(data);
    });
    return unsubscribe;
};

const saveDocument = async <T extends { id: string }>(
  collectionName: string,
  data: T
): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  const dataWithTimestamps = Object.fromEntries(
    Object.entries(data).map(([key, value]) =>
      value instanceof Date ? [key, Timestamp.fromDate(value)] : [key, value]
    )
  );
  await setDoc(doc(db, collectionName, data.id), dataWithTimestamps, { merge: true });
};

const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, collectionName, id));
};

// Bookings
export const getBookings = () => getCollectionData<Booking>('bookings');
export const saveBooking = (booking: Booking) =>
  saveDocument('bookings', booking);
export const deleteBooking = (id: string) => deleteDocument('bookings', id);

// Customers
export const getCustomers = () => getCollectionData<Customer>('customers');
export const saveCustomer = (customer: Customer) =>
  saveDocument('customers', customer);
export const deleteCustomer = (id: string) => deleteDocument('customers', id);

// Services
export const getServices = () => getCollectionData<Service>('services');
export const saveService = (service: Service) => saveDocument('services', service);
export const deleteService = (id: string) => deleteDocument('services', id);

// Stylists
export const getStylists = () => getCollectionData<Stylist>('stylists');
export const saveStylist = (stylist: Stylist) => saveDocument('stylists', stylist);
export const deleteStylist = (id: string) => deleteDocument('stylists', id);

// Products
export const getProducts = () => getCollectionData<Product>('products');
export const saveProduct = (product: Product) => saveDocument('products', product);
export const deleteProduct = (id: string) => deleteDocument('products', id);

// Contact Messages
export const saveMessage = (message: ContactMessage) => saveDocument('messages', message);

export const seedInitialData = async (
  services: Service[],
  customers: Customer[],
  bookings: Booking[],
  stylists: Stylist[],
  products: Product[]
) => {
    if (!db) {
        console.error('Firestore is not initialized.');
        return;
    }

    const checkAndSeed = async (collectionName: string, data: any[]) => {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        if (snapshot.empty) {
            console.log(`Seeding ${collectionName}...`);
            const batch = writeBatch(db);
            data.forEach((item) => {
                const docRef = doc(db, collectionName, item.id);
                 const dataWithTimestamps = Object.fromEntries(
                    Object.entries(item).map(([key, value]) =>
                    value instanceof Date ? [key, Timestamp.fromDate(value)] : [key, value]
                    )
                );
                batch.set(docRef, dataWithTimestamps);
            });
            await batch.commit();
            console.log(`${collectionName} seeded successfully.`);
        } else {
             console.log(`${collectionName} already has data. Skipping seed.`);
        }
    };

    try {
        await checkAndSeed('services', services);
        await checkAndSeed('customers', customers);
        await checkAndSeed('bookings', bookings);
        await checkAndSeed('stylists', stylists);
        await checkAndSeed('products', products);
        console.log('Initial data seeding check complete.');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};
