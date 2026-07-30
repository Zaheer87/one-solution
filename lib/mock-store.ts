import { ServiceItem, TechnicianProfile, EnterpriseLead, Category, Review } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { $id: 'cat-electrical', name: 'Electrical', iconName: 'Zap', isActive: true },
  { $id: 'cat-plumbing', name: 'Plumbing', iconName: 'Droplets', isActive: true },
  { $id: 'cat-hvac', name: 'HVAC', iconName: 'Fan', isActive: true },
  { $id: 'cat-cleaning', name: 'Cleaning', iconName: 'Sparkles', isActive: true },
  { $id: 'cat-carpentry', name: 'Carpentry', iconName: 'Hammer', isActive: true },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    $id: 'srv-1',
    name: 'Electrical Inspection',
    categoryId: 'cat-electrical',
    description: 'Comprehensive electrical system safety check and report.',
    basePrice: 15000, // 150.00
    durationMinutes: 90,
    isActive: true,
  },
  {
    $id: 'srv-2',
    name: 'Emergency Plumbing',
    categoryId: 'cat-plumbing',
    description: '24/7 rapid response for leaks, bursts, and blockages.',
    basePrice: 20000, // 200.00
    durationMinutes: 60,
    isActive: true,
  },
  {
    $id: 'srv-3',
    name: 'AC Installation',
    categoryId: 'cat-hvac',
    description: 'Professional installation of split or window air conditioning units.',
    basePrice: 35000, // 350.00
    durationMinutes: 180,
    isActive: true,
  },
];

export const INITIAL_TECHNICIANS: TechnicianProfile[] = [
  {
    $id: 'tech-1',
    userId: 'mock-user-tech-1',
    categoryIds: ['cat-electrical', 'cat-plumbing'],
    serviceIds: ['srv-1', 'srv-2'],
    experienceYears: 8,
    hourlyRate: 8500, // 85.00
    averageRating: 4.9,
    reviewCount: 142,
    status: 'verified',
    bio: 'Master electrician and certified plumber with 8+ years of field experience.',
    isAvailable: true,
  },
  {
    $id: 'tech-2',
    userId: 'mock-user-tech-2',
    categoryIds: ['cat-hvac'],
    serviceIds: ['srv-3'],
    experienceYears: 5,
    hourlyRate: 7500, // 75.00
    averageRating: 4.7,
    reviewCount: 89,
    status: 'verified',
    bio: 'HVAC specialist focused on energy-efficient installations.',
    isAvailable: true,
  },
];

export const INITIAL_LEADS: EnterpriseLead[] = [
  {
    $id: 'lead-1',
    companyName: 'TechCorp Offices',
    contactName: 'Sarah Jenkins',
    email: 'sarah@techcorp.example.com',
    phone: '+1 (555) 123-4567',
    serviceType: 'Office Deep Cleaning & HVAC Maintenance',
    estimatedLocations: 3,
    notes: 'Require monthly service contracts for all three regional offices.',
    status: 'new',
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    $id: 'rev-1',
    bookingId: 'bk-mock-1',
    clientId: 'client-1',
    technicianId: 'tech-1',
    serviceId: 'srv-1',
    rating: 5,
    comment: 'Excellent work and very professional.',
  }
];
