import { databases, appwriteConfig } from '../config';
import { ServiceItem } from '../../types';

const { databaseId, servicesCollectionId } = appwriteConfig;

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const res = await databases.listDocuments(databaseId, servicesCollectionId);
    return res.documents.map((d) => ({ ...d, id: d.$id } as unknown as ServiceItem));
  } catch (e) {
    console.error('[getServices]', e);
    return [];
  }
}

export async function saveService(service: ServiceItem): Promise<void> {
  try {
    try {
      await databases.getDocument(databaseId, servicesCollectionId, service.$id);
      // Document exists, update it
      // Filter out the "id" field if it is part of the object
      const { $id, ...data } = service;
      await databases.updateDocument(databaseId, servicesCollectionId, service.$id, data);
    } catch {
      // Document doesn't exist, create it
      const { $id, ...data } = service;
      await databases.createDocument(databaseId, servicesCollectionId, service.$id, data);
    }
  } catch (e) {
    console.error('[saveService]', e);
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    await databases.deleteDocument(databaseId, servicesCollectionId, id);
  } catch (e) {
    console.error('[deleteService]', e);
  }
}
