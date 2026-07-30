import { databases, appwriteConfig, ID } from '../config';
import { Review } from '../../types';
import { Query } from 'appwrite';

const { databaseId, reviewsCollectionId } = appwriteConfig;

export async function getReviewsByTechnician(technicianId: string): Promise<Review[]> {
  try {
    const res = await databases.listDocuments(databaseId, reviewsCollectionId, [
      Query.equal('technicianId', technicianId),
    ]);
    return res.documents.map((d) => ({ ...d, $id: d.$id } as unknown as Review));
  } catch (e) {
    console.error('[getReviewsByTechnician]', e);
    return [];
  }
}

export async function createReview(review: Omit<Review, '$id'>): Promise<Review> {
  try {
    const res = await databases.createDocument(databaseId, reviewsCollectionId, ID.unique(), review);
    return { ...review, $id: res.$id } as Review;
  } catch (e) {
    console.error('[createReview]', e);
    throw e;
  }
}
