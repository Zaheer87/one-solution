import { databases, appwriteConfig, ID } from '../config';
import { EnterpriseLead } from '../../types';
import { Query } from 'appwrite';

const { databaseId, leadsCollectionId } = appwriteConfig;

export async function getLeads(): Promise<EnterpriseLead[]> {
  try {
    const res = await databases.listDocuments(databaseId, leadsCollectionId, [
      Query.orderDesc('createdAt'),
    ]);
    return res.documents.map((d) => ({ ...d, id: d.$id } as unknown as EnterpriseLead));
  } catch (e) {
    try {
        const res = await databases.listDocuments(databaseId, leadsCollectionId);
        return res.documents.map((d) => ({ ...d, id: d.$id } as unknown as EnterpriseLead));
    } catch (err) {
        return [];
    }
  }
}

export async function createLead(leadData: Omit<EnterpriseLead, '$id'>): Promise<EnterpriseLead> {
  try {
    const res = await databases.createDocument(databaseId, leadsCollectionId, ID.unique(), leadData);
    return { ...leadData, $id: res.$id } as EnterpriseLead;
  } catch (e) {
    console.error('[createLead]', e);
    throw e;
  }
}

export async function updateLeadStatus(
  leadId: string,
  status: EnterpriseLead['status']
): Promise<void> {
  try {
    await databases.updateDocument(databaseId, leadsCollectionId, leadId, { status });
  } catch (e) {
    console.error('[updateLeadStatus]', e);
  }
}
