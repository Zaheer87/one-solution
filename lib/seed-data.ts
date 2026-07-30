/**
 * Appwrite Seed Script
 * Checks if collections are empty, and if so,
 * populates them with the initial demo data.
 * Called once on first admin dashboard load.
 */

import { INITIAL_SERVICES, INITIAL_TECHNICIANS, INITIAL_LEADS, INITIAL_CATEGORIES, INITIAL_REVIEWS } from './mock-store';
import {
  getCategories,
  createCategory,
  getServices,
  saveService,
  getTechnicians,
  saveTechnician,
  getLeads,
  createLead,
  createReview,
} from './appwrite/services';

export async function seedFirestoreIfEmpty(): Promise<boolean> {
  try {
    const [categories, services, techs] = await Promise.all([
      getCategories(),
      getServices(),
      getTechnicians(),
    ]);

    if (categories.length > 0 && services.length > 0 && techs.length > 0) {
      // Already seeded
      return false;
    }

    const promises: Promise<any>[] = [];

    // Seed categories if empty
    if (categories.length === 0) {
      INITIAL_CATEGORIES.forEach((cat) => {
        const { $id, ...catData } = cat;
        promises.push(createCategory(catData));
      });
    }

    // Seed services if empty
    if (services.length === 0) {
      INITIAL_SERVICES.forEach((srv) => {
        promises.push(saveService(srv));
      });
    }

    // Seed technicians if empty
    if (techs.length === 0) {
      INITIAL_TECHNICIANS.forEach((tech) => {
        promises.push(saveTechnician(tech));
      });
    }

    // Seed one demo lead if leads are empty
    const leads = await getLeads();
    if (leads.length === 0) {
      INITIAL_LEADS.forEach((lead) => {
        const { $id, ...leadData } = lead;
        promises.push(createLead(leadData));
      });
    }

    // Seed reviews
    // Wait, reviews need bookingId, client, etc. Just seeding initial mock
    INITIAL_REVIEWS.forEach((rev) => {
        const { $id, ...revData } = rev;
        promises.push(createReview(revData));
    });

    await Promise.all(promises);
    console.log('[Seed] Appwrite seeded with initial data.');
    return true;
  } catch (e) {
    console.error('[Seed] Failed to seed Appwrite:', e);
    return false;
  }
}
