import { databases, appwriteConfig } from '../config';
import { Booking } from '../../types';
import { Query } from 'appwrite';

const { databaseId, bookingsCollectionId } = appwriteConfig;

export async function getBookings(): Promise<Booking[]> {
  try {
    const res = await databases.listDocuments(databaseId, bookingsCollectionId, [
      Query.orderDesc('createdAt'),
    ]);
    return res.documents.map((d) => ({ ...d, id: d.$id } as unknown as Booking));
  } catch (e) {
    console.warn('[getBookings] orderDesc failed, using simple query', e);
    try {
        const res = await databases.listDocuments(databaseId, bookingsCollectionId);
        return res.documents.map((d) => ({ ...d, id: d.$id } as unknown as Booking));
    } catch (err) {
        return [];
    }
  }
}

export async function getBookingsByClient(clientId: string): Promise<Booking[]> {
  try {
    const res = await databases.listDocuments(databaseId, bookingsCollectionId, [
      Query.equal('clientId', clientId),
      Query.orderDesc('createdAt'),
    ]);
    return res.documents.map((d) => ({ ...d, id: d.$id } as unknown as Booking));
  } catch (e) {
    console.warn('[getBookingsByClient] orderDesc failed, using simple query', e);
    try {
        const res = await databases.listDocuments(databaseId, bookingsCollectionId, [
            Query.equal('clientId', clientId)
        ]);
        return res.documents.map((d) => ({ ...d, id: d.$id } as unknown as Booking));
    } catch (err) {
        return [];
    }
  }
}

export async function getBookingsByTechnician(technicianId: string): Promise<Booking[]> {
  try {
    const res = await databases.listDocuments(databaseId, bookingsCollectionId, [
      Query.equal('technicianId', technicianId),
    ]);
    return res.documents.map((d) => ({ ...d, id: d.$id } as unknown as Booking));
  } catch (e) {
    console.error('[getBookingsByTechnician]', e);
    return [];
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const doc = await databases.getDocument(databaseId, bookingsCollectionId, id);
    return { ...doc, id: doc.$id } as unknown as Booking;
  } catch (e) {
    console.error('[getBookingById]', e);
    return null;
  }
}

export async function createBooking(booking: Booking): Promise<Booking> {
  try {
    const { $id, ...data } = booking;
    await databases.createDocument(databaseId, bookingsCollectionId, booking.$id, data);
    return booking;
  } catch (e) {
    console.error('[createBooking]', e);
    throw e;
  }
}

export async function updateBooking(
  bookingId: string,
  updates: Partial<Booking>
): Promise<void> {
  try {
    await databases.updateDocument(databaseId, bookingsCollectionId, bookingId, updates);
  } catch (e) {
    console.error('[updateBooking]', e);
  }
}
