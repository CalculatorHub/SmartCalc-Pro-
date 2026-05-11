import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  deleteDoc,
  getDocs,
  limit
} from "firebase/firestore";
import { db } from "../lib/firebase";

const COLLECTION_NAME = "finance";

export const saveFinanceRecord = async (data: { 
  type: string; 
  inputs: any; 
  result: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      userId: "anonymous",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Failed to save finance record:", error);
    throw error;
  }
};

export const subscribeToFinance = (callback: (data: any[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME), 
    orderBy("createdAt", "desc"),
    limit(50)
  );
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  }, (error) => {
    console.error("Finance Subscription Error:", error);
  });
};

export const deleteFinanceRecord = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Failed to delete finance record:", error);
    throw error;
  }
};
