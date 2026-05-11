import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
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
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
