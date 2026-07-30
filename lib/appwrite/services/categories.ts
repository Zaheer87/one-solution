import { databases, appwriteConfig, ID } from '../config';
import { Category } from '../../types';
import { Query } from 'appwrite';

const { databaseId, categoriesCollectionId } = appwriteConfig;

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await databases.listDocuments(databaseId, categoriesCollectionId);
    return res.documents.map((d) => ({ ...d, $id: d.$id } as unknown as Category));
  } catch (e) {
    console.error('[getCategories]', e);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const doc = await databases.getDocument(databaseId, categoriesCollectionId, id);
    return { ...doc, $id: doc.$id } as unknown as Category;
  } catch (e) {
    console.error('[getCategoryById]', e);
    return null;
  }
}

export async function createCategory(category: Omit<Category, '$id'>): Promise<Category> {
  try {
    const res = await databases.createDocument(databaseId, categoriesCollectionId, ID.unique(), category);
    return { ...category, $id: res.$id } as Category;
  } catch (e) {
    console.error('[createCategory]', e);
    throw e;
  }
}
