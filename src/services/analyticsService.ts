import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const STATS_DOC_PATH = 'stats/visitors';

export const trackVisitor = async (userName?: string) => {
  try {
    // 1. Generate / Get Unique User ID
    let userId = localStorage.getItem('smartcalpro_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('smartcalpro_user_id', userId);
    }

    // 2. Check Last Visit Date to avoid duplicate counting per day
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastVisitDate = localStorage.getItem('smartcalpro_last_visit');

    // We still update the visitor_list if name is provided, even if already counted for stats
    if (userName) {
      const visitorRef = doc(db, `visitor_list/${userId}_${today}`);
      await setDoc(visitorRef, {
        userId,
        name: userName,
        timestamp: serverTimestamp(),
        date: today
      });
    }

    if (lastVisitDate === today) {
      return;
    }

    // 3. Update Database
    const statsRef = doc(db, STATS_DOC_PATH);
    const dailyRef = doc(db, `stats/daily_${today}`); // Simple doc per day

    // Use a try-catch for the first visit ever (doc might not exist)
    const statsDoc = await getDoc(statsRef);
    
    // Update Total Count
    if (!statsDoc.exists()) {
      await setDoc(statsRef, {
        totalCount: 1,
        lastUpdated: serverTimestamp()
      });
    } else {
      await updateDoc(statsRef, {
        totalCount: increment(1),
        lastUpdated: serverTimestamp()
      });
    }

    // Update Daily Count
    const dailyDoc = await getDoc(dailyRef);
    if (!dailyDoc.exists()) {
      await setDoc(dailyRef, {
        dailyCount: 1,
        date: today,
        lastUpdated: serverTimestamp()
      });
    } else {
      await updateDoc(dailyRef, {
        dailyCount: increment(1),
        lastUpdated: serverTimestamp()
      });
    }

    // 4. Update Local Storage ONLY AFTER SUCCESSFUL DB UPDATE
    localStorage.setItem('smartcalpro_last_visit', today);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "stats_update");
    return false;
  }
};

export const getVisitorStats = async () => {
  try {
    const statsRef = doc(db, STATS_DOC_PATH);
    const statsDoc = await getDoc(statsRef);
    
    if (statsDoc.exists()) {
      return statsDoc.data();
    }
    return { totalCount: 0 };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, STATS_DOC_PATH);
    return { totalCount: 0 };
  }
};
