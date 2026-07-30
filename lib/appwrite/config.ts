import { Client, Account, Databases, Storage, ID } from 'appwrite';

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || '',
  servicesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SERVICES_COLLECTION_ID || '',
  techniciansCollectionId: process.env.NEXT_PUBLIC_APPWRITE_TECHNICIANS_COLLECTION_ID || '',
  bookingsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID || '',
  leadsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID || '',
  categoriesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CATEGORIE_COLLECTION_ID || '',
  reviewsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_REVIEW_COLLECTION_ID || '',
  storageBucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '',
};

const client = new Client();

if (appwriteConfig.endpoint && appwriteConfig.projectId) {
  client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };
