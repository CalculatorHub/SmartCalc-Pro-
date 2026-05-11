import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Ensure we have a valid configuration object
const config = firebaseConfig as any;

let app;
try {
  app = getApps().length === 0 ? initializeApp(config) : getApp();
} catch (e) {
  console.error("[FIREBASE] App initialization failed:", e);
  app = getApp(); // Try to recover existing
}

const dbId = config.firestoreDatabaseId;
let firestoreInstance: any;

try {
  if (dbId && dbId !== "(default)") {
    firestoreInstance = getFirestore(app, dbId);
    console.log(`[FIREBASE] Named Database Instance Attached: ${dbId}`);
  } else {
    firestoreInstance = getFirestore(app);
    console.log("[FIREBASE] Default Database Instance Attached");
  }
} catch (e) {
  console.warn("[FIREBASE] Named database failed, falling back to default:", e);
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;

// Connection Test as per Guidelines
async function testConnection() {
  if (!db) {
    console.error("[FIREBASE] Critical Error: DB instance is null");
    return;
  }
  
  try {
    // Basic connectivity check - use a safe path
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("[FIREBASE] Neural Link: SECURE");
  } catch (error: any) {
    // We expect 403 if it exists but is not public, which is fine for a connection test
    if (error.code === 'permission-denied') {
      console.log("[FIREBASE] Neural Link: CONNECTED (Rules active)");
    } else if (error.message?.includes('the client is offline')) {
      console.error("[FIREBASE] Neural Link Offline.");
    } else {
      console.warn("[FIREBASE] Connection warning:", error.code, error.message);
    }
  }
}
testConnection();
