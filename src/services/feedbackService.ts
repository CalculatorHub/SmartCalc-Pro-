import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  limit
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";

const COLLECTION_NAME = "feedback";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const submitFeedback = async (data: { 
  name?: string; 
  message: string; 
  type: string; 
  rating: number;
}) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      userId: auth.currentUser?.uid || "anonymous",
      createdAt: serverTimestamp(),
      status: "unread",
      browser: navigator.userAgent.split(' ')[0],
      os: navigator.platform
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
  }
};

export const subscribeToFeedback = (callback: (data: any[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  });
};

export const clearAllFeedback = async () => {
  const ref = collection(db, COLLECTION_NAME);
  
  try {
    console.log("Fetching all feedback for master purge...");
    const snapshot = await getDocs(ref);

    if (snapshot.empty) {
      console.log("Purge unnecessary: No transmissions detected.");
      return 0;
    }

    const batch = writeBatch(db);
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Purge successful: ${snapshot.size} items deleted.`);
    return snapshot.size;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, COLLECTION_NAME);
    return 0;
  }
};

export const removeMultipleFeedback = async (ids: string[]) => {
  const batch = writeBatch(db);
  try {
    ids.forEach(id => {
      batch.delete(doc(db, COLLECTION_NAME, id));
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/bulk`);
  }
};

export const updateFeedbackStatus = async (id: string, data: any) => {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
};
