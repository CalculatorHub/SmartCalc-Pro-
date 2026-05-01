import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PRICES_CACHE_KEY = 'smartcalpro_prices_cache';
const STATS_DOC_PATH = 'system/price_health';

export interface LivePrices {
  gold24: number;
  gold24Prev?: number;
  gold22: number;
  gold22Prev?: number;
  silver: number;
  silverPrev?: number;
  petrol: number;
  petrolPrev?: number;
  diesel: number;
  dieselPrev?: number;
  lastUpdated: string;
  source: 'api' | 'fallback' | 'firestore';
  metalsSynced: boolean;
  fuelSynced: boolean;
  metalsError?: string;
  fuelError?: string;
  fuelSyncStatus: 'live' | 'static' | 'error';
  isStale?: boolean;
}

const FALLBACK_PRICES: LivePrices = {
  gold24: 8650,
  gold22: 7930,
  silver: 115,
  petrol: 136.20,
  diesel: 121.50,
  lastUpdated: new Date().toISOString(),
  source: 'fallback',
  metalsSynced: false,
  fuelSynced: false,
  fuelSyncStatus: 'static'
};

const fetchFromProxy = async (): Promise<Partial<LivePrices> | null> => {
  try {
    const response = await fetch('/api/prices/metals');
    if (!response.ok) return null;
    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Proxy Fetch Error:', error);
    return null;
  }
};

export const fetchAllPrices = async (city: string = 'Andhra Pradesh'): Promise<LivePrices> => {
  try {
    // 0. Try fetching from Backend Proxy First (Secure Pattern)
    const proxyData = await fetchFromProxy();

    // 1. Fetch Global Metal Prices from Firestore
    const metalsRef = doc(db, 'metadata', 'prices');
    const metalsSnap = await getDoc(metalsRef);
    const metalsData = metalsSnap.exists() ? metalsSnap.data() : null;

    // Use proxy data to override if available
    const finalMetalsData = proxyData ? { ...metalsData, ...proxyData } : metalsData;

    // 2. Fetch City Fuel Prices
    const METRO_CITIES = ['delhi', 'mumbai', 'chennai', 'kolkata', 'bengaluru', 'hyderabad', 'vijayawada', 'visakhapatnam', 'andhra_pradesh'];
    // Normalize city for firestore doc ID (lowercase, trimmed)
    const normalizedCity = city.toLowerCase().trim().replace(/\s+/g, '_');
    const cityId = METRO_CITIES.includes(normalizedCity) ? normalizedCity : 'andhra_pradesh';
    
    const fuelRef = doc(db, 'fuel_rates', cityId);
    const fuelSnap = await getDoc(fuelRef);
    const fuelData = fuelSnap.exists() ? fuelSnap.data() : null;

    // Default to a general "Andhra Pradesh" rate if specific city not found
    let finalFuelData = fuelData;
    if (!finalFuelData) {
      const genericRef = doc(db, 'fuel_rates', 'andhra_pradesh');
      const genericSnap = await getDoc(genericRef);
      finalFuelData = genericSnap.exists() ? genericSnap.data() : null;
    }

    const lastUpdatedDate = finalMetalsData?.updatedAt ? new Date(finalMetalsData.updatedAt) : new Date();
    // 6 hours for stale check
    const isStale = (new Date().getTime() - lastUpdatedDate.getTime()) > (6 * 60 * 60 * 1000);

    const liveData: LivePrices = {
      gold24: finalMetalsData?.gold24 || FALLBACK_PRICES.gold24,
      gold24Prev: finalMetalsData?.gold24Prev,
      gold22: finalMetalsData?.gold22 || FALLBACK_PRICES.gold22,
      gold22Prev: finalMetalsData?.gold22Prev,
      silver: finalMetalsData?.silver || FALLBACK_PRICES.silver,
      silverPrev: finalMetalsData?.silverPrev,
      petrol: finalFuelData?.petrol || FALLBACK_PRICES.petrol,
      petrolPrev: finalFuelData?.petrolPrev,
      diesel: finalFuelData?.diesel || FALLBACK_PRICES.diesel,
      dieselPrev: finalFuelData?.dieselPrev,
      lastUpdated: lastUpdatedDate.toISOString(),
      source: proxyData ? 'api' : 'firestore',
      metalsSynced: !!finalMetalsData,
      fuelSynced: !!finalFuelData,
      fuelSyncStatus: !!finalFuelData ? 'live' : 'static',
      isStale
    };

    localStorage.setItem(PRICES_CACHE_KEY, JSON.stringify(liveData));
    return liveData;

  } catch (error) {
    console.error('Firestore Price Sync Error:', error);
    const cached = localStorage.getItem(PRICES_CACHE_KEY);
    return cached ? JSON.parse(cached) : FALLBACK_PRICES;
  }
};

const updateSystemHealth = async (success: boolean) => {
  try {
    const healthRef = doc(db, STATS_DOC_PATH);
    const healthDoc = await getDoc(healthRef);
    
    const data = {
      lastFetchTime: serverTimestamp(),
      status: success ? 'Success' : 'Failed',
      updatedBy: 'PriceService'
    };

    if (!healthDoc.exists()) {
      await setDoc(healthRef, data);
    } else {
      await updateDoc(healthRef, data);
    }
  } catch (e) {
    console.error('Failed to update system health:', e);
  }
};

export const getCachedPrices = (): LivePrices => {
  const cached = localStorage.getItem(PRICES_CACHE_KEY);
  return cached ? JSON.parse(cached) : FALLBACK_PRICES;
};
