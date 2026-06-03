import { Listing, ListingInput, ListingSchema } from './schema';

// Simulation of Infrastructure
const DB_KEY = 'marketplace_listings_db';

// Mock DB Initial Seed with Rich Data
const INITIAL_LISTINGS: Listing[] = [
  {
    id: '1',
    user_id: 'usr_1',
    title: 'Pro 14 Max Smartphone - 256GB Global Version (Unlocked)',
    description: 'The latest Pro 14 Max features an stunning 6.7-inch Super Retina XDR display. Experience the power of the A16 Bionic chip, the most advanced smartphone chip ever.',
    price: 42000,
    oldPrice: 58000,
    category: 'phones',
    wilaya_code: 16,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
    rating: 4.9,
    reviewsCount: 1420,
    soldCount: "4.8k+",
    colors: [
      { name: 'Midnight Black', hex: '#1C1D21', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800' },
      { name: 'Emerald Green', hex: '#005A36', image: 'https://images.unsplash.com/photo-1574755393849-623942496936?w=800' },
      { name: 'Titanium Gold', hex: '#D4AF37', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800' },
    ],
    sizes: ['128GB', '256GB', '512GB'],
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    user_id: 'usr_2',
    title: 'Modern Leather Sofa',
    description: 'Extremely comfortable 3-seater leather sofa. Dark brown color. Perfect for modern living rooms.',
    price: 45000,
    oldPrice: 55000,
    category: 'furniture',
    wilaya_code: 31,
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/923bebcc-1cd5-494e-973c-8e594ee7fca9/furniture-hero-1-15c90753-1780480164843.webp'],
    rating: 4.7,
    reviewsCount: 85,
    soldCount: "120",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    user_id: 'usr_3',
    title: 'Samsung Washing Machine 9kg',
    description: 'Digital Inverter technology, 9kg capacity. 1 year used, like new. Energy efficient and quiet operation.',
    price: 68000,
    category: 'home_appliances',
    wilaya_code: 25,
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/923bebcc-1cd5-494e-973c-8e594ee7fca9/home-appliances-hero-1-0ccae65f-1780480165552.webp'],
    rating: 4.8,
    reviewsCount: 42,
    soldCount: "50+",
    created_at: new Date(Date.now() - 10800000).toISOString(),
  }
];

// Helper to get from "Postgres" (LocalStorage)
const getDB = (): Listing[] => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_LISTINGS));
    return INITIAL_LISTINGS;
  }
  return JSON.parse(data);
};

// Mock Redis Store (In-memory for the session)
const redisStore = new Map<string, string>();

/**
 * MOCKED BACKEND API
 */
export const mockApi = {
  // POST /api/v1/listings
  createListing: async (data: ListingInput): Promise<{ success: boolean; data: Listing }> => {
    await new Promise(r => setTimeout(r, 800));
    const validatedData = ListingSchema.parse(data);
    const userId = 'usr_987654321';
    
    const newListing: Listing = {
      id: `lst_${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      ...validatedData,
      created_at: new Date().toISOString(),
      // Add defaults for fields not in the form
      rating: 4.5,
      reviewsCount: 0,
      soldCount: "0",
    };

    const db = getDB();
    db.unshift(newListing);
    localStorage.setItem(DB_KEY, JSON.stringify(db));

    // Write-Through Cache: Populate "Redis" immediately
    redisStore.set(`listing:${newListing.id}`, JSON.stringify(newListing));
    redisStore.delete(`feed:${validatedData.category}:${validatedData.wilaya_code}`);

    return { success: true, data: newListing };
  },

  // GET /api/v1/listings
  getListings: async (category?: string, wilaya_code?: number): Promise<{ source: 'cache' | 'database'; data: Listing[] }> => {
    await new Promise(r => setTimeout(r, 500));
    const cacheKey = `feed:${category}:${wilaya_code}`;
    const cachedData = redisStore.get(cacheKey);
    if (cachedData) return { source: 'cache', data: JSON.parse(cachedData) };

    let listings = getDB();
    if (category) listings = listings.filter(l => l.category === category);
    if (wilaya_code) listings = listings.filter(l => l.wilaya_code === wilaya_code);

    redisStore.set(cacheKey, JSON.stringify(listings));
    return { source: 'database', data: listings };
  },

  // GET /api/v1/listings/:id
  getListingById: async (id: string): Promise<{ source: 'cache' | 'database'; data: Listing }> => {
    await new Promise(r => setTimeout(r, 600));
    const cacheKey = `listing:${id}`;
    
    // 1. Look up cached listings to protect the primary database
    const cachedData = redisStore.get(cacheKey);
    if (cachedData) {
      console.log(`--- REDIS HIT for listing:${id} ---`);
      return { source: 'cache', data: JSON.parse(cachedData) };
    }

    // 2. Cache Miss -> Pull from Postgres database (Mocked)
    console.log(`--- POSTGRES QUERY for listing:${id} ---`);
    const db = getDB();
    const listing = db.find(l => l.id === id);
    
    if (!listing) throw new Error('Listing not found');

    // 3. Store in cache for 1 hour (Simulated)
    redisStore.set(cacheKey, JSON.stringify(listing));

    return { source: 'database', data: listing };
  }
};
