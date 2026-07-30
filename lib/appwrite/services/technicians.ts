import { databases, appwriteConfig } from '../config';
import { TechnicianProfile } from '../../types';
import { Query } from 'appwrite';

const { databaseId, techniciansCollectionId } = appwriteConfig;

export async function getTechnicians(status?: TechnicianProfile['status']): Promise<TechnicianProfile[]> {
  try {
    const queries = [];
    if (status) queries.push(Query.equal('status', status));
    const res = await databases.listDocuments(databaseId, techniciansCollectionId, queries);
    return res.documents as unknown as TechnicianProfile[];
  } catch (e) {
    console.error('[getTechnicians]', e);
    return [];
  }
}

export async function getTechnicianByUserId(userId: string): Promise<TechnicianProfile | null> {
  try {
    const res = await databases.listDocuments(databaseId, techniciansCollectionId, [
      Query.equal('userId', userId),
    ]);
    if (res.documents.length === 0) return null;
    return res.documents[0] as unknown as TechnicianProfile;
  } catch (e) {
    console.error('[getTechnicianByUserId]', e);
    return null;
  }
}

export async function getTechnicianById(id: string): Promise<TechnicianProfile | null> {
  try {
    const doc = await databases.getDocument(databaseId, techniciansCollectionId, id);
    return doc as unknown as TechnicianProfile;
  } catch (e) {
    console.error('[getTechnicianById]', e);
    return null;
  }
}

export async function saveTechnician(tech: TechnicianProfile): Promise<void> {
  try {
    const { $id, ...data } = tech;
    try {
      await databases.getDocument(databaseId, techniciansCollectionId, tech.$id);
      await databases.updateDocument(databaseId, techniciansCollectionId, tech. $id, data);
    } catch {
      await databases.createDocument(databaseId, techniciansCollectionId, tech.$id, data);
    }
  } catch (e) {
    console.error('[saveTechnician]', e);
  }
}

export async function updateTechnicianStatus(
  techId: string,
  status: TechnicianProfile['status']
): Promise<void> {
  try {
    await databases.updateDocument(databaseId, techniciansCollectionId, techId, { status });
  } catch (e) {
    console.error('[updateTechnicianStatus]', e);
  }
}

export async function updateTechnicianAvailability(
  techId: string,
  isAvailable: boolean
): Promise<void> {
  try {
    await databases.updateDocument(databaseId, techniciansCollectionId, techId, { isAvailable });
  } catch (e) {
    console.error('[updateTechnicianAvailability]', e);
  }
}
