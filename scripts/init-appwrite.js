const { Client, Databases, ID, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env' });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !databaseId || !apiKey) {
  console.error('Missing required environment variables (ENDPOINT, PROJECT_ID, DATABASE_ID, APPWRITE_API_KEY).');
  process.exit(1);
}

const client = new Client();
client
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

const defaultPermissions = [
  Permission.read(Role.any()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

async function createCollectionIfNotExist(collectionId, name) {
  try {
    await databases.getCollection(databaseId, collectionId);
    console.log(`[Collection] ${name} (${collectionId}) already exists. Updating permissions...`);
    await databases.updateCollection(databaseId, collectionId, name, defaultPermissions);
  } catch (err) {
    if (err.code === 404) {
      console.log(`[Collection] Creating ${name} (${collectionId})...`);
      await databases.createCollection(databaseId, collectionId, name, defaultPermissions);
      console.log(`[Collection] Created ${name}.`);
    } else {
      throw err;
    }
  }
}

async function createAttr(dbId, collId, type, key, required, sizeOrDefault, isArray = false) {
  try {
    if (type === 'string') {
      await databases.createStringAttribute(dbId, collId, key, sizeOrDefault, required, undefined, isArray);
    } else if (type === 'integer') {
      await databases.createIntegerAttribute(dbId, collId, key, required, undefined, undefined, sizeOrDefault, isArray);
    } else if (type === 'boolean') {
      await databases.createBooleanAttribute(dbId, collId, key, required, sizeOrDefault, isArray);
    } else if (type === 'float') {
      await databases.createFloatAttribute(dbId, collId, key, required, undefined, undefined, sizeOrDefault, isArray);
    }
    console.log(`  + Created attribute: ${key} (${type}) in ${collId}`);
  } catch (err) {
    if (err.code === 409) {
      console.log(`  ~ Attribute ${key} already exists in ${collId}.`);
    } else {
      console.error(`  ! Error creating attribute ${key}: ${err.message}`);
    }
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function initSchema() {
  const schema = {
    [process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID]: {
      name: 'Users',
      attributes: [
        { key: 'name', type: 'string', required: true, size: 255 },
        { key: 'email', type: 'string', required: true, size: 255 },
        { key: 'phone', type: 'string', required: false, size: 20 },
        { key: 'address', type: 'string', required: false, size: 1000 },
        { key: 'avatarUrl', type: 'string', required: false, size: 2000 },
        { key: 'role', type: 'string', required: true, size: 50, default: 'client' },
      ],
    },
    [process.env.NEXT_PUBLIC_APPWRITE_CATEGORIE_COLLECTION_ID]: {
      name: 'Categories',
      attributes: [
        { key: 'name', type: 'string', required: true, size: 100 },
        { key: 'iconName', type: 'string', required: true, size: 50 },
        { key: 'description', type: 'string', required: false, size: 1000 },
        { key: 'isActive', type: 'boolean', required: true, default: true },
      ],
    },
    [process.env.NEXT_PUBLIC_APPWRITE_SERVICES_COLLECTION_ID]: {
      name: 'Services',
      attributes: [
        { key: 'name', type: 'string', required: true, size: 255 },
        { key: 'categoryId', type: 'string', required: true, size: 50 },
        { key: 'description', type: 'string', required: true, size: 2000 },
        { key: 'basePrice', type: 'integer', required: true },
        { key: 'durationMinutes', type: 'integer', required: true },
        { key: 'imageUrl', type: 'string', required: false, size: 2000 },
        { key: 'isActive', type: 'boolean', required: true, default: true },
      ],
    },
    [process.env.NEXT_PUBLIC_APPWRITE_TECHNICIANS_COLLECTION_ID]: {
      name: 'Technicians',
      attributes: [
        { key: 'userId', type: 'string', required: true, size: 50 },
        { key: 'name', type: 'string', required: false, size: 255 },
        { key: 'email', type: 'string', required: false, size: 255 },
        { key: 'avatarUrl', type: 'string', required: false, size: 2000 },
        { key: 'categoryIds', type: 'string', required: false, size: 50, isArray: true },
        { key: 'serviceIds', type: 'string', required: false, size: 50, isArray: true },
        { key: 'experienceYears', type: 'integer', required: true },
        { key: 'hourlyRate', type: 'integer', required: true },
        { key: 'averageRating', type: 'float', required: true, default: 0 },
        { key: 'reviewCount', type: 'integer', required: true, default: 0 },
        { key: 'bio', type: 'string', required: false, size: 2000 },
        { key: 'documentUrl', type: 'string', required: false, size: 2000 },
        { key: 'status', type: 'string', required: true, size: 50, default: 'pending' },
        { key: 'isAvailable', type: 'boolean', required: true, default: true },
      ],
    },
    [process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID]: {
      name: 'Bookings',
      attributes: [
        { key: 'clientId', type: 'string', required: true, size: 50 },
        { key: 'technicianId', type: 'string', required: false, size: 50 },
        { key: 'serviceId', type: 'string', required: true, size: 50 },
        { key: 'bookingDate', type: 'string', required: true, size: 50 },
        { key: 'timeSlot', type: 'string', required: true, size: 100 },
        { key: 'address', type: 'string', required: true, size: 1000 },
        { key: 'notes', type: 'string', required: false, size: 2000 },
        { key: 'totalPrice', type: 'integer', required: true },
        { key: 'status', type: 'string', required: true, size: 50 },
        { key: 'completionProofUrl', type: 'string', required: false, size: 2000 },
        { key: 'completionNotes', type: 'string', required: false, size: 2000 },
        { key: 'clientName', type: 'string', required: false, size: 255 },
        { key: 'clientPhone', type: 'string', required: false, size: 50 },
        { key: 'technicianName', type: 'string', required: false, size: 255 },
        { key: 'serviceName', type: 'string', required: false, size: 255 },
      ],
    },
    [process.env.NEXT_PUBLIC_APPWRITE_REVIEW_COLLECTION_ID]: {
      name: 'Reviews',
      attributes: [
        { key: 'bookingId', type: 'string', required: true, size: 50 },
        { key: 'clientId', type: 'string', required: true, size: 50 },
        { key: 'technicianId', type: 'string', required: true, size: 50 },
        { key: 'serviceId', type: 'string', required: true, size: 50 },
        { key: 'rating', type: 'integer', required: true },
        { key: 'comment', type: 'string', required: false, size: 2000 },
      ],
    },
    [process.env.NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID]: {
      name: 'Leads',
      attributes: [
        { key: 'companyName', type: 'string', required: true, size: 255 },
        { key: 'contactName', type: 'string', required: true, size: 255 },
        { key: 'email', type: 'string', required: true, size: 255 },
        { key: 'phone', type: 'string', required: true, size: 50 },
        { key: 'serviceType', type: 'string', required: true, size: 100 },
        { key: 'estimatedLocations', type: 'integer', required: true },
        { key: 'notes', type: 'string', required: false, size: 2000 },
        { key: 'assignedTo', type: 'string', required: false, size: 50 },
        { key: 'followUpDate', type: 'string', required: false, size: 50 },
        { key: 'status', type: 'string', required: true, size: 50, default: 'new' },
      ],
    }
  };

  for (const [collectionId, config] of Object.entries(schema)) {
    if (!collectionId) continue;
    
    console.log(`\n--- Initializing Collection: ${config.name} ---`);
    await createCollectionIfNotExist(collectionId, config.name);

    for (const attr of config.attributes) {
      // Small delay to prevent Appwrite rate limits / overlap errors when creating attributes
      await sleep(200); 
      let sizeOrDefault = attr.type === 'string' ? attr.size : attr.default;
      await createAttr(databaseId, collectionId, attr.type, attr.key, attr.required, sizeOrDefault, attr.isArray);
    }
  }

  console.log('\n--- Schema Initialization Complete! ---');
}

initSchema().catch(console.error);
