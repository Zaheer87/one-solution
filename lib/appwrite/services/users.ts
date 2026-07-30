import { databases, appwriteConfig } from '../config';
import { UserProfile } from '../../types';
import { Query } from 'appwrite';

const { databaseId, usersCollectionId } = appwriteConfig;

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const doc = await databases.getDocument(databaseId, usersCollectionId, uid);
    return doc as unknown as UserProfile;
  } catch (e) {
    console.error('[getUserProfile]', e);
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    const { $id, $createdAt, $updatedAt, ...data } = profile as any;
    try {
      await databases.getDocument(databaseId, usersCollectionId, profile.$id);
      // Document exists, update it
      await databases.updateDocument(databaseId, usersCollectionId, profile.$id, data);
    } catch {
      // Document doesn't exist, create it
      await databases.createDocument(databaseId, usersCollectionId, profile.$id, data);
    }
  } catch (e) {
    console.error('[saveUserProfile]', e);
    throw e;
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const res = await databases.listDocuments(databaseId, usersCollectionId);
    return res.documents as unknown as UserProfile[];
  } catch (e) {
    console.error('[getAllUsers]', e);
    return [];
  }
}
