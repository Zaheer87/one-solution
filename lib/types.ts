export type UserRole = 'client' | 'technician' | 'admin';

export interface AppwriteDocument {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface UserProfile extends AppwriteDocument {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface Category extends AppwriteDocument {
  name: string;
  iconName: string;
  description?: string;
  isActive: boolean;
}

export interface ServiceItem extends AppwriteDocument {
  name: string;
  categoryId: string;
  description: string;
  basePrice: number; // in paise
  durationMinutes: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface TechnicianProfile extends AppwriteDocument {
  userId: string;
  name?: string; // snapshot field
  email?: string; // snapshot field
  avatarUrl?: string; // snapshot field
  categoryIds: string[];
  serviceIds: string[];
  experienceYears: number;
  hourlyRate: number; // in paise
  averageRating: number;
  reviewCount: number;
  bio?: string;
  documentUrl?: string;
  status: 'pending' | 'verified' | 'rejected' | 'suspended';
  isAvailable: boolean;
}

export interface Booking extends AppwriteDocument {
  clientId: string;
  technicianId?: string;
  serviceId: string;
  bookingDate: string; // ISO String
  timeSlot: string;
  address: string;
  notes?: string;
  totalPrice: number; // in paise
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  completionProofUrl?: string;
  completionNotes?: string;
  // Snapshot fields
  clientName?: string;
  clientPhone?: string;
  technicianName?: string;
  serviceName?: string;
}

export interface Review extends AppwriteDocument {
  bookingId: string;
  clientId: string;
  technicianId: string;
  serviceId: string;
  rating: number;
  comment?: string;
}

export interface EnterpriseLead extends AppwriteDocument {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  serviceType: string;
  estimatedLocations: number;
  notes?: string;
  assignedTo?: string;
  followUpDate?: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
}
